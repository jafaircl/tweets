import {
  Body,
  CacheInterceptor,
  Controller,
  Get,
  Param,
  Patch,
  UseInterceptors,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { MetricsService } from '@tweets/features';
import { PatchMetricsDto } from '@tweets/models';

@ApiTags('metrics')
@Controller('metrics')
@UseInterceptors(CacheInterceptor)
export class MetricsController {
  constructor(private readonly _metricsService: MetricsService) {}

  @Get(':id')
  @ApiOperation({
    summary: 'Get metrics',
    description: `Get the metrics for a single tweet.`,
    parameters: [
      {
        name: 'id',
        description: 'The ID of the tweet the metrics are for',
        required: true,
        in: 'path',
        example: '100001',
      },
    ],
  })
  @ApiResponse({ status: 200, description: 'Success' })
  async getOne(@Param('id') id: string) {
    return this._metricsService.findOne({ where: { tweetID: id } });
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Patch metrics',
    description: `This allows some unknown service to patch a metrics update for a tweet. If the tweet does not already exist, it will be created with default (0) values for the missing properties.`,
    parameters: [
      {
        name: 'id',
        description: 'The ID of the tweet',
        required: true,
        in: 'path',
        example: '100001',
      },
    ],
  })
  @ApiResponse({ status: 200, description: 'Success' })
  async patch(
    @Param('id') id: string,
    @Body() patchMetricsDto: PatchMetricsDto
  ) {
    // All we are going to do here is send a message to a queue. The reasons for this are:
    // 1) If many updates come in at once, we a) don't risk crashing the server due to memory errors, b) don't slow down the rest of
    // the API by occupying the main thread, c) can distribute the work over time instead of creating huge spikes of work
    // 2) We can scale the number of consumers (and server costs) with demand.
    // 3) If the consumer dies before handling the update, we can retry it.
    // 3) It will allow us to keep track of messages that were not handled so that we can debug.
    await this._metricsService.emitMetricsPatchRequestedMessage(
      id,
      patchMetricsDto
    );
    return `metrics for tweet with id: ${id} are being updated`;
  }
}
