import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';
import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import {
  MetricsService,
  METRICS_PATCH_COMMITTED,
  METRICS_PATCH_REQUESTED,
} from '@tweets/features';
import {
  metricsEntityFromJSON,
  PatchMetricsDto,
  patchMetricsEntity,
} from '@tweets/models';
import { isNil } from '@tweets/utils';
import { validate } from 'class-validator';

@Controller()
export class AppController {
  constructor(
    private readonly _amqpConnection: AmqpConnection,
    private readonly _metricsService: MetricsService
  ) {}

  @MessagePattern(METRICS_PATCH_REQUESTED)
  async handleMetricsPatchRequested(
    @Payload()
    data: {
      id: string;
      patchMetricsDto: PatchMetricsDto;
      date: number;
    }
  ) {
    // Fetch the existing metrics object
    let metrics = await this._metricsService.findOne({
      where: { tweetID: data.id },
    });
    if (isNil(metrics)) {
      // If metrics for this tweet don't exist, create them
      const createdMetricsObject = metricsEntityFromJSON({
        tweetID: data.id,
        ...data.patchMetricsDto,
      });
      // Validate the object before saving
      const errors = await validate(createdMetricsObject);
      if (errors.length > 0) {
        throw new Error(errors.toString());
      }
      // Save the metrics object
      metrics = await this._metricsService.create(createdMetricsObject);
    } else {
      // First, make sure the object has not been updated since the message was sent
      if (metrics.updatedAt.getTime() > data.date) {
        // If it has, return early and don't do anything. We shouldn't overwrite new data with old data
        return;
      }
      // If they do exist, update the existing object
      const cls = metricsEntityFromJSON(metrics);
      const updatedMetricsObject = patchMetricsEntity(
        cls,
        data.patchMetricsDto
      );
      // Validate the object before saving
      const errors = await validate(updatedMetricsObject);
      if (errors.length > 0) {
        throw new Error(errors.toString());
      }
      // Save the metrics object
      metrics = await this._metricsService.update(
        { id: metrics.id },
        updatedMetricsObject
      );
    }
    this._amqpConnection.publish(
      METRICS_PATCH_COMMITTED,
      METRICS_PATCH_COMMITTED,
      { id: metrics.id, tweetID: metrics.tweetID }
    );
    return metrics;
  }
}
