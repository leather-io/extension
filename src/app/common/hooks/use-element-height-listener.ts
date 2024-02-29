import { useEffect } from 'react';

export function useElementHeightListener(
  ref: React.RefObject<HTMLDivElement>,
  listener: (height: number) => void
) {
  useEffect(() => {
    if (!ref.current) return;

    const resizeObserver = new ResizeObserver(entries => {
      const observedHeight = entries[0].contentRect.height;
      listener(observedHeight);
    });

    resizeObserver.observe(ref.current);

    return () => {
      // Cleanup the observer when the component is unmounted
      resizeObserver.disconnect();
    };
  }, [listener, ref]);
}
