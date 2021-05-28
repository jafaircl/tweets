import { deepFreeze } from './deep-freeze';

describe('deepFreeze', () => {
  it('should exist and be a function', () => {
    expect(deepFreeze).toBeTruthy();
    expect(deepFreeze).toBeInstanceOf(Function);
  });

  it('should create a frozen object', () => {
    const orig = deepFreeze({ foo: 'foo' });

    expect(() => {
      orig['foo' as string] = 'bar';
    }).toThrowError(
      "Cannot assign to read only property 'foo' of object '#<Object>'"
    );
  });

  it('should work recursively', () => {
    const orig = deepFreeze({ foo: { bar: 'bar' } });

    expect(() => {
      orig.foo['bar' as string] = 'foo';
    }).toThrowError(
      "Cannot assign to read only property 'bar' of object '#<Object>'"
    );
  });

  it('should handle already frozen objects', () => {
    const orig = deepFreeze({ foo: { bar: 'bar' } });
    const obj = deepFreeze(orig);

    expect(() => {
      obj.foo['bar' as string] = 'foo';
    }).toThrowError(
      "Cannot assign to read only property 'bar' of object '#<Object>'"
    );
  });

  it('should work with arrays', () => {
    const orig = deepFreeze(['foo']);
    expect(() => {
      ((orig as unknown) as unknown[]).push('bar');
    }).toThrow();
  });
});
