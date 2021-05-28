import { Args, Query, Resolver } from '@nestjs/graphql';
import { MetricsService } from '@tweets/features';
import { MetricsEntity } from '@tweets/models';

@Resolver(() => MetricsEntity)
export class MetricsEntityResolver {
  constructor(private readonly _metricsService: MetricsService) {}

  @Query(() => MetricsEntity)
  async findMetricsByTweetID(@Args('id') id: string) {
    return this._metricsService.findOne({ where: { tweetID: id } });
  }
}
