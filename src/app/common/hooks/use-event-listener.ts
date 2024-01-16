import { useEffect } from 'react';

import { useLatestRef } from './use-latest-ref';

// eslint-disable-next-line @typescript-eslint/ban-types
type FunctionArguments<T extends Function> = T extends (...args: infer R) => any ? R : never;
type AddEventListener = FunctionArguments<typeof document.addEventListener>;

let _window: Window | undefined = undefined;

// Note: Accessing "window" in IE11 is somewhat expensive, and calling "typeof window"
// hits a memory leak, whereas aliasing it and calling "typeof _window" does not.
// Caching the window value at the file scope lets us minimize the impact.
try {
  _window = window;
} catch (e) {
  /* no-op */
}

/**
 * Helper to get the window object. The helper will make sure to use a cached variable
 * of "window", to avoid overhead and memory leaks in IE11.
 */
function getWindow(node?: HTMLElement | null): Window | undefined {
  return node?.ownerDocument?.defaultView ?? _window;
}

/**
 * Check if we can use the DOM. Useful for SSR purposes
 */
function checkIsBrowser() {
  const _window = getWindow();
  return Boolean(
    // eslint-disable-next-line @typescript-eslint/unbound-method, deprecation/deprecation
    typeof _window !== 'undefined' && _window.document && _window.document.createElement
  );
}

const isBrowser = checkIsBrowser();

/**
 * React hook to manage browser event listeners
 *
 * @param event the event name
 * @param handler the event handler function to execute
 * @param element the dom environment to execute against (defaults to `document`)
 * @param options the event listener options
 */
export function useEventListener(
  event: keyof WindowEventMap,
  handler: (event: any) => void,
  element: Document | null = isBrowser ? document : null,
  options?: AddEventListener[2]
) {
  const savedHandler = useLatestRef(handler);

  useEffect(() => {
    if (!element) return;

    const listener = (event: any) => {
      savedHandler.current(event);
    };

    element.addEventListener(event, listener, options);

    return () => {
      element.removeEventListener(event, listener, options);
    };
  }, [event, element, options, savedHandler]);

  return () => {
    element?.removeEventListener(event, savedHandler.current, options);
  };
}
