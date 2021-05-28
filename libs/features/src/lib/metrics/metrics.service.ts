import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { InjectRepository } from '@nestjs/typeorm';
import {
  MetricsEntity,
  metricsEntityFromJSON,
  PatchMetricsDto,
  patchMetricsEntity,
} from '@tweets/models';
import {
  DeepPartial,
  FindConditions,
  FindManyOptions,
  FindOneOptions,
  Repository,
} from 'typeorm';
import {
  METRICS_PATCH_COMMITTED,
  METRICS_PATCH_REQUESTED,
  METRICS_SUBSCRIBER_SERVICE,
} from './metrics.constants';

@Injectable()
export class MetricsService {
  constructor(
    @InjectRepository(MetricsEntity)
    private readonly _metricsEntityRepository: Repository<MetricsEntity>,
    @Inject(METRICS_SUBSCRIBER_SERVICE)
    private _metricsSubscriberService: ClientProxy
  ) {}

  async onApplicationBootstrap() {
    await this._metricsSubscriberService.connect();
  }

  async create(
    entity: DeepPartial<Omit<MetricsEntity, 'createdAt' | 'updatedAt'>>
  ) {
    const created = metricsEntityFromJSON(entity);
    return this._metricsEntityRepository.save(created);
  }

  async findAll(options?: FindManyOptions<MetricsEntity>) {
    return this._metricsEntityRepository.find(options);
  }

  async findByIds(ids: number[]) {
    return this._metricsEntityRepository.findByIds(ids);
  }

  async findOne(criteria: FindOneOptions<MetricsEntity>) {
    return this._metricsEntityRepository.findOne(criteria);
  }

  async update(
    criteria: FindConditions<MetricsEntity>,
    update: DeepPartial<Omit<MetricsEntity, 'createdAt' | 'updatedAt'>>
  ) {
    const existing = await this._metricsEntityRepository.findOne(criteria);
    const updated = patchMetricsEntity(existing, update);
    return this._metricsEntityRepository.save(updated);
  }

  async emitMetricsPatchRequestedMessage(
    id: string,
    patchMetricsDto: PatchMetricsDto
  ) {
    return this._metricsSubscriberService.emit(METRICS_PATCH_REQUESTED, {
      id,
      patchMetricsDto,
      date: Date.now(),
    });
  }

  async emitMetricsPatchCommittedMessage(id: string, tweetID: string) {
    return this._metricsSubscriberService.emit(METRICS_PATCH_COMMITTED, {
      id,
      tweetID,
    });
  }
}
