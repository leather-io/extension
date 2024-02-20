import { forwardRef } from 'react';

import * as RadixTooltip from '@radix-ui/react-tooltip';
import { css } from 'leather-styles/css';

function Root(props: RadixTooltip.TooltipProps) {
  return <RadixTooltip.Root {...props} />;
}

function Portal(props: RadixTooltip.TooltipPortalProps) {
  return <RadixTooltip.Portal {...props} />;
}

const Trigger: typeof RadixTooltip.Trigger = forwardRef((props, ref) => (
  <RadixTooltip.Trigger ref={ref} {...props} />
));

const Content: typeof RadixTooltip.Content = forwardRef(({ className, ...props }, ref) => (
  <RadixTooltip.Content className={`${defaultContentStyles} ${className}`} ref={ref} {...props} />
));

const Arrow: typeof RadixTooltip.Arrow = forwardRef(({ className, ...props }, ref) => (
  <RadixTooltip.Arrow
    className={`${defaultTooltipArrowStyles} ${className}`}
    ref={ref}
    {...props}
  />
));

export const Tooltip = {
  Root,
  Portal,
  Trigger,
  Content,
  Arrow,
};

const defaultContentStyles = css({
  bg: 'ink.action-primary-default',
  borderRadius: 'xs',
  px: 'space.03',
  py: 'space.02',
  textStyle: 'body.02',
  animationDuration: '400ms',
  animationTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
  willChange: 'transform, opacity',
  maxWidth: '250px',
  textAlign: 'center',
  wordWrap: 'break-word',
  color: 'ink.background-primary',

  "&[data-state='delayed-open'][data-side='top']": {
    animationName: 'slideDownAndFade',
  },
  "&[data-state='delayed-open'][data-side='right']": {
    animationName: 'slideLeftAndFade',
  },
  "&[data-state='delayed-open'][data-side='bottom']": {
    animationName: 'slideUpAndFade',
  },
  "&[data-state='delayed-open'][data-side='left']": {
    animationName: 'slideRightAndFade',
  },
});

const defaultTooltipArrowStyles = css({
  fill: 'ink.action-primary-default',
});
