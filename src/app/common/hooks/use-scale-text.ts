import { useRef } from 'react';

import { useOnMount } from '@app/common/hooks/use-on-mount';

export function useScaleText() {
  const ref = useRef<HTMLHeadingElement>(null);

  useOnMount(() => {
    const el = ref.current;
    if (el) {
      const parentWidth = el.parentElement?.offsetWidth || 0;
      const naturalWidth = el.scrollWidth;
      const scale = parentWidth / naturalWidth;
      const finalScale = Math.max(scale);
      el.style.transform = finalScale < 1 ? `scale(${finalScale})` : 'none';
    }
  });

  return ref;
}
