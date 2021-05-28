import { plainToClassFromExist } from 'class-transformer';
import { MetricsEntity } from '../metrics.entity';
import { IMetrics } from '../metrics.interface';

export const patchMetricsEntity = (
  metricsEntity: MetricsEntity,
  input: Partial<IMetrics>
) => {
  return plainToClassFromExist(metricsEntity, input, {
    exposeUnsetFields: true,
    exposeDefaultValues: true,
  });
};
