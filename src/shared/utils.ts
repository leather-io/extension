export function isNumber(value: unknown): value is number {
  return typeof value === 'number';
}

export function isString(value: unknown): value is string {
  return typeof value === 'string';
}

export function isUndefined(value: unknown): value is undefined {
  return typeof value === 'undefined';
}

export function isFunction(value: unknown): value is Function {
  return typeof value === 'function';
}

export function isObject(value: unknown): value is object {
  return typeof value === 'object';
}

export function isEmpty(value: Object) {
  return Object.keys(value).length === 0;
}

export function noop() {}
