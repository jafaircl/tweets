import { plainToClass } from 'class-transformer';
import { MetricsEntity } from '../metrics.entity';
import { IMetrics } from '../metrics.interface';

export const metricsEntityFromJSON = (
  metrics?: Partial<IMetrics>
): MetricsEntity => {
  return plainToClass(MetricsEntity, metrics ?? {}, {
    exposeUnsetFields: true,
    exposeDefaultValues: true,
  });
};
