import { isBoolean, isNumber, isObject, isString } from 'class-validator';
import { isFunction } from './isFunction';
import { isNil } from './isNil';

export const deepFreeze = <T>(obj: T): T => {
  if (isNil(obj) || isString(obj) || isNumber(obj) || isBoolean(obj)) {
    return obj;
  }
  const props = Object.getOwnPropertyNames(obj);
  for (const prop of props) {
    if (
      obj.hasOwnProperty(prop) &&
      !isNil(obj[prop]) &&
      (isObject(obj[prop]) || isFunction(obj[prop])) &&
      !Object.isFrozen(obj[prop])
    ) {
      deepFreeze(obj[prop]);
    }
  }
  return Object.freeze(obj);
};
