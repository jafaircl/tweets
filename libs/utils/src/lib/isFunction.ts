export const isFunction = <ValueType = () => unknown>(
  value: unknown | ValueType
): value is ValueType => {
  return (
    typeof value === 'function' ||
    Object.getPrototypeOf(value) === Function.prototype
  );
};
