import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsOptional } from 'class-validator';
import { IMetrics } from '../metrics.interface';

export class PatchMetricsDto implements Partial<IMetrics> {
  @IsInt()
  @IsOptional()
  @ApiProperty({
    example: 1,
    description: 'The number of retweets',
    required: false,
  })
  retweets?: number;

  @IsInt()
  @IsOptional()
  @ApiProperty({
    example: 1,
    description: 'The number of favorites',
    required: false,
  })
  favorites?: number;

  @IsInt()
  @IsOptional()
  @ApiProperty({
    example: 1,
    description: 'The number of replies',
    required: false,
  })
  replies?: number;

  @IsInt()
  @IsOptional()
  @ApiProperty({
    example: 1,
    description: 'The number of media clicks',
    required: false,
  })
  media_clicks?: number;

  @IsInt()
  @IsOptional()
  @ApiProperty({
    example: 1,
    description: 'The number of impressions',
    required: false,
  })
  impressions?: number;
}
