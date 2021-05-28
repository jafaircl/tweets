import { CacheModule, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MetricsFeatureModule } from '@tweets/features';
import { DateScalar } from '@tweets/utils';
import * as redisStore from 'cache-manager-redis-store';
import { MetricsController } from './metrics.controller';
import { MetricsEntityResolver } from './metrics.resolver';

@Module({
  imports: [
    MetricsFeatureModule,
    CacheModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        store: redisStore,
        host: configService.get('REDIS_HOST'),
        port: configService.get('REDIS_PORT'),
        ttl: configService.get('REDIS_CACHE_TTL'),
        max: configService.get('REDIS_CACHE_SIZE'),
      }),
    }),
  ],
  controllers: [MetricsController],
  providers: [MetricsEntityResolver, DateScalar],
})
export class MetricsModule {}
