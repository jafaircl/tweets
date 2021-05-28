import { Module, Provider } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientProxyFactory, Transport } from '@nestjs/microservices';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MetricsEntity } from '@tweets/models';
import { METRICS_SUBSCRIBER_SERVICE } from './metrics.constants';
import { MetricsService } from './metrics.service';

const MetricsSubscriberService: Provider = {
  provide: METRICS_SUBSCRIBER_SERVICE,
  useFactory: (configService: ConfigService) => {
    const user = configService.get('RABBITMQ_USER');
    const password = configService.get('RABBITMQ_PASSWORD');
    const host = configService.get('RABBITMQ_HOST');
    const queueName = configService.get('RABBITMQ_TWEET_METRICS_QUEUE_NAME');

    return ClientProxyFactory.create({
      transport: Transport.RMQ,
      options: {
        urls: [`amqp://${user}:${password}@${host}`],
        queue: queueName,
        // noAck: true,
        queueOptions: {
          durable: true,
        },
      },
    });
  },
  inject: [ConfigService],
};

@Module({
  imports: [ConfigModule, TypeOrmModule.forFeature([MetricsEntity])],
  exports: [MetricsService, MetricsSubscriberService],
  providers: [MetricsService, MetricsSubscriberService],
})
export class MetricsFeatureModule {}
