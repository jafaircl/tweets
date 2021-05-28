import { isFunction } from './isFunction';

describe('isFunction', () => {
  it('should exist and be a function', () => {
    expect(isFunction).toBeTruthy();
    expect(isFunction).toBeInstanceOf(Function);
  });

  it('should return true for a function', () => {
    const arrowFn = () => null;
    function traditionalFn() {
      return null;
    }
    expect(isFunction(arrowFn)).toEqual(true);
    expect(isFunction(traditionalFn)).toEqual(true);
  });

  it('should return false for things that are not a function', () => {
    expect(isFunction(0)).toEqual(false);
    expect(isFunction('')).toEqual(false);
    expect(isFunction(null)).toEqual(false);
    expect(isFunction(undefined)).toEqual(false);
    expect(isFunction({})).toEqual(false);
    expect(isFunction([])).toEqual(false);
  });
});
