import { MetricsEntity } from '../metrics.entity';
import { patchMetricsEntity } from './patch-metrics-entity';

describe('patchMetricsEntity', () => {
  it('should patch a metrics entity from a JSON object', () => {
    const metrics = new MetricsEntity();
    const patched = patchMetricsEntity(metrics, { impressions: 1 });
    expect(patched).toBeInstanceOf(MetricsEntity);
    expect(patched.favorites).toEqual(0);
    expect(patched.impressions).toEqual(1);
  });

  it('should leave the old value untouched', () => {
    const metrics = new MetricsEntity();
    const patched = patchMetricsEntity(metrics, { impressions: 1 });
    expect(metrics.impressions).toEqual(0);
    expect(patched.impressions).toEqual(1);
  });
});
