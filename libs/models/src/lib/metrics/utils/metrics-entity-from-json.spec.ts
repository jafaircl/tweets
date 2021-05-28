import { MetricsEntity } from '../metrics.entity';
import { metricsEntityFromJSON } from './metrics-entity-from-json';

describe('metricsEntityFromJSON', () => {
  it('should create a metrics entity with no input', () => {
    const metrics = metricsEntityFromJSON();
    expect(metrics).toBeInstanceOf(MetricsEntity);
    expect(metrics.favorites).toEqual(0);
    expect(metrics.impressions).toEqual(0);
  });

  it('should create a metrics entity from a JSON object', () => {
    const metrics = metricsEntityFromJSON({ impressions: 1 });
    expect(metrics).toBeInstanceOf(MetricsEntity);
    expect(metrics.favorites).toEqual(0);
    expect(metrics.impressions).toEqual(1);
  });
});
