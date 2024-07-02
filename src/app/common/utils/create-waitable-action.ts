import { noop } from '@leather.io/utils';

// TODO: Migrate to @leather.io/utils
export function createWaitableAction<T = unknown>() {
  let resolve = (_value?: unknown) => noop();
  const promise = new Promise(r => (resolve = r));
  return {
    done(value?: T) {
      resolve(value);
    },
    wait() {
      return promise as Promise<T>;
    },
  };
}
