// TypeScript port of https://github.com/DavidWells/safe-await/
import { isError } from '@leather.io/utils';

// Native Error types https://mzl.la/2Veh3TR
const nativeExceptions = [
  EvalError,
  RangeError,
  ReferenceError,
  SyntaxError,
  TypeError,
  URIError,
].filter(except => typeof except === 'function');

function throwNative(error: Error) {
  for (const Exception of nativeExceptions) {
    if (error instanceof Exception) throw error;
  }
}

// TODO: Migrate to `@leather.io/utils`
export async function safeAwait<T>(promise: Promise<T>, finallyFn?: () => void) {
  return promise
    .then(data => {
      if (isError(data)) {
        throwNative(data);
        return [data] as readonly [Error];
      }
      return [undefined, data] as const;
    })
    .catch((error: Error) => {
      throwNative(error);
      return [error] as const;
    })
    .finally(() => {
      if (finallyFn) finallyFn();
    });
}
