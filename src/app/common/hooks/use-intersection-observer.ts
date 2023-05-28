import { RefObject, useEffect } from 'react';

export function useIntersectionObserver(
  elementRef: RefObject<Element>,
  intersectionCallback: IntersectionObserverCallback,
  { threshold = 0, root = null, rootMargin = '0% 0% 20% 0%' }
) {
  return useEffect(() => {
    if (
      !('IntersectionObserver' in window) ||
      !('IntersectionObserverEntry' in window) ||
      !elementRef.current
    ) {
      // TO-DO: add error handling
      return;
    }

    const observer = new IntersectionObserver(intersectionCallback, {
      threshold,
      root,
      rootMargin,
    });

    observer.observe(elementRef.current);

    return () => observer.disconnect();
  }, [elementRef, intersectionCallback, threshold, root, rootMargin]);
}
