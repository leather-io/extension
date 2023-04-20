// https://github.com/moldy530/react-use-scroll-lock/blob/master/src/use-scroll-lock.ts
import { useEffect, useState } from 'react';

declare global {
  // tslint:disable-next-line: interface-name
  interface Window {
    __useScrollLockStyle: string | undefined | null;
    __useScrollLockInstances: Set<Record<string, unknown>> | undefined | null;
  }
}

let instances: Set<Record<string, unknown>> = new Set();

if (typeof window !== 'undefined') {
  // this is necessary because we may share instances of this file on a page so we store these globally
  window.__useScrollLockInstances =
    window.__useScrollLockInstances || new Set<Record<string, unknown>>();
  instances = window.__useScrollLockInstances;
}

const registerInstance = (instance: Record<string, unknown>) => {
  if (instances.size === 0) {
    setBodyOverflow(true);
  }

  instances.add(instance);
};

const unregisterInstance = (instance: Record<string, unknown>) => {
  instances.delete(instance);

  if (instances.size === 0) {
    setBodyOverflow(false);
  }
};

const setBodyOverflow = (shouldLock: boolean) => {
  if (shouldLock) {
    document.body.classList.add('no-scroll');
  } else {
    document.body.classList.remove('no-scroll');
  }
};

export const useScrollLock = (shouldLock: boolean) => {
  // we generate a unique reference to the component that uses this thing
  const [elementId] = useState({});

  useEffect(() => {
    if (shouldLock) {
      registerInstance(elementId);
    }

    // Re-enable scrolling when component unmounts
    return () => unregisterInstance(elementId);
  }, [elementId, shouldLock]); // ensures effect is only run on mount, unmount, and on shouldLock change
};
