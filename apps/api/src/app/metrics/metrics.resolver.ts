import { RabbitSubscribe } from '@golevelup/nestjs-rabbitmq';
import { CACHE_MANAGER, Inject } from '@nestjs/common';
import { Args, Query, Resolver, Subscription } from '@nestjs/graphql';
import { MetricsService, METRICS_PATCH_COMMITTED } from '@tweets/features';
import { MetricsEntity } from '@tweets/models';
import { isNil } from '@tweets/utils';
import { Cache } from 'cache-manager';
import { RedisPubSub } from 'graphql-redis-subscriptions';
import { PubSub } from 'graphql-subscriptions';

const pubSub = new PubSub();

@Resolver(() => MetricsEntity)
export class MetricsEntityResolver {
  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private readonly _metricsService: MetricsService,
    @Inject('PUB_SUB') private readonly _pubSub: RedisPubSub
  ) {}

  @Query(() => MetricsEntity)
  async findMetricsByTweetID(@Args('id') id: string) {
    const cachedValue = await this.cacheManager.get(id);
    if (!isNil(cachedValue)) {
      return cachedValue;
    }
    const returnValue = await this._metricsService.findOne({
      where: { tweetID: id },
    });
    await this.cacheManager.set(id, returnValue);
    return returnValue;
  }

  @RabbitSubscribe({
    exchange: METRICS_PATCH_COMMITTED,
    routingKey: METRICS_PATCH_COMMITTED,
    queue: METRICS_PATCH_COMMITTED,
  })
  public async pubSubHandler(payload: { id: string; tweetID: string }) {
    const metrics = await this._metricsService.findOne({
      where: [{ id: payload.id }, { tweetID: payload.tweetID }],
    });
    this._pubSub.publish(METRICS_PATCH_COMMITTED, metrics);
  }

  @Subscription(() => MetricsEntity, {
    name: 'subscribeToMetricsByTweetIDs',
    resolve: (data) => data,
    filter: (payload: MetricsEntity, variables: { ids: string[] }) =>
      variables.ids.indexOf(payload.tweetID) > -1,
  })
  public async subscribeToMetricsByTweetIDs(
    @Args('ids', { type: () => [String] }) ids: string[]
  ) {
    return this._pubSub.asyncIterator(METRICS_PATCH_COMMITTED);
  }
}
