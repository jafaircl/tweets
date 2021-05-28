import { Field, ObjectType } from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsDate,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  VersionColumn,
} from 'typeorm';
import { IMetrics } from './metrics.interface';

@Entity()
@ObjectType()
export class MetricsEntity implements IMetrics {
  @PrimaryGeneratedColumn('uuid')
  @Field()
  @IsUUID()
  @IsOptional()
  @ApiProperty({
    example: '635e6eef-4280-43c2-a289-98f3e9b406ac',
    description: 'The ID of the metrics object',
  })
  public id: string;

  @CreateDateColumn({ type: 'timestamptz' })
  @Field()
  @IsDate()
  @IsOptional()
  @ApiProperty({
    example: '2021-05-28T14:37:19.803Z',
    description: 'The date the metrics were created',
  })
  public createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  @Field()
  @IsDate()
  @IsOptional()
  @ApiProperty({
    example: '2021-05-28T14:37:19.803Z',
    description: 'The date the metrics were last updated',
  })
  public updatedAt: Date;

  @VersionColumn({ nullable: true })
  @Field()
  @IsNumber()
  @IsOptional()
  @ApiProperty({
    example: 1,
    description: 'The version number of the metrics',
  })
  public version: number;

  @Column({ unique: true })
  @Field()
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 100001, description: 'The id of the tweet' })
  public tweetID: string;

  @Column({ default: 0 })
  @Field()
  @IsInt()
  @ApiProperty({ example: 1, description: 'The number of retweets' })
  public retweets: number = 0;

  @Column({ default: 0 })
  @Field()
  @IsInt()
  @ApiProperty({ example: 1, description: 'The number of favorites' })
  public favorites: number = 0;

  @Column({ default: 0 })
  @Field()
  @IsInt()
  @ApiProperty({ example: 1, description: 'The number of replies' })
  public replies: number = 0;

  @Column({ default: 0 })
  @Field()
  @IsInt()
  @ApiProperty({ example: 1, description: 'The number of media clicks' })
  public media_clicks: number = 0;

  @Column({ default: 0 })
  @Field()
  @IsInt()
  @ApiProperty({ example: 1, description: 'The number of impressions' })
  public impressions: number = 0;
}
