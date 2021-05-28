import { isNil } from './isNil';

describe('isNil', () => {
  it('should exist and be a function', () => {
    expect(isNil).toBeTruthy();
    expect(isNil).toBeInstanceOf(Function);
  });

  it('should return true for null or undefined', () => {
    expect(isNil(null)).toEqual(true);
    expect(isNil(undefined)).toEqual(true);
  });

  it('should return false for things that are not null or undefined', () => {
    expect(isNil(0)).toEqual(false);
    expect(isNil('')).toEqual(false);
    expect(isNil({})).toEqual(false);
    expect(isNil([])).toEqual(false);
    expect(isNil(() => null)).toEqual(false);
  });
});
