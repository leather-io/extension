import { motion, stagger, useAnimate } from 'framer-motion';
import { css } from 'leather-styles/css';

import type { HasChildren } from '@app/common/has-children';
import { useOnMount } from '@app/common/hooks/use-on-mount';

const animationSelector = '& > *:not(.skip-animation)';

export const childElementInitialAnimationState = css({
  [animationSelector]: { opacity: 0, transform: 'translateY(-16px)' },
});

const staggerMenuItems = stagger(0.06, { startDelay: 0.36 });

export function useApproverChildrenEntryAnimation() {
  const [scope, animate] = useAnimate();

  useOnMount(() => {
    // Animation throws if there are no children
    try {
      animate(
        animationSelector,
        { opacity: 1, transform: 'translateY(0)' },
        {
          duration: 0.36,
          delay: staggerMenuItems,
          ease: 'easeOut',
        }
      );
    } catch (e) {}
  });

  return scope;
}

interface ApproverHeaderAnimationProps extends HasChildren {
  delay?: number;
}
export function ApproverHeaderAnimation({ delay = 0, ...props }: ApproverHeaderAnimationProps) {
  return (
    <motion.div
      initial={{ x: -18, opacity: 0 }}
      animate={{ x: 0, opacity: 1, transition: { duration: 0.4, delay, ease: 'easeOut' } }}
      {...props}
    />
  );
}

export function ApproverActionsAnimation(props: HasChildren) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1, transition: { duration: 0.4, delay: 0.68, ease: 'easeOut' } }}
      {...props}
    />
  );
}
