import { useRef, useState } from 'react';

import { motion } from 'framer-motion';

import type { HasChildren } from '@app/common/has-children';
import { useElementHeightListener } from '@app/common/hooks/use-element-height-listener';

// https://github.com/framer/motion/discussions/1884#discussioncomment-5861808

export function AnimateChangeInHeight({ children }: HasChildren) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [height, setHeight] = useState<number | 'auto'>('auto');
  useElementHeightListener(containerRef, height => setHeight(height));

  return (
    <motion.div
      style={{ height, overflow: 'hidden' }}
      animate={{ height }}
      transition={{ duration: 0.15 }}
    >
      <div ref={containerRef}>{children}</div>
    </motion.div>
  );
}
