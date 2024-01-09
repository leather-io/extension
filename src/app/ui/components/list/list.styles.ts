import { css } from 'leather-styles/css';

export const defaultTriggerStyles = css({
  bg: 'accent.background-primary',
  borderRadius: '2px',
  fontWeight: 500,
  maxWidth: 'fit-content',
  maxHeight: 'fit-content',
  px: 'space.04',
  py: 'space.03',
  textStyle: 'label.02',

  '&[data-state=open]': {
    bg: 'accent.component-background-pressed',
  },
});

export const listContentStyles = css({
  animationDuration: '400ms',
  animationTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
  '--base-menu-padding': '0px',
  bg: 'accent.background-primary',
  borderRadius: '2px',
  boxShadow:
    '0px 12px 24px 0px rgba(18, 16, 15, 0.08), 0px 4px 8px 0px rgba(18, 16, 15, 0.08), 0px 0px 2px 0px rgba(18, 16, 15, 0.08)',
  minWidth: '256px',
  willChange: 'transform, opacity',
  zIndex: 999,

  '&[data-side=bottom]': {
    animationName: 'slideUpAndFade',
  },
});

export const listSectionLabelStyles = css({
  height: 'auto',
  px: 'space.02',
});

export const listItemStyles = css({
  bg: 'accent.background-primary',
  color: 'accent.text-primary',
  height: 'auto',
  outline: 'none',
  px: 'space.02',
  userSelect: 'none',

  '&[data-highlighted]': {
    bg: 'accent.component-background-hover',
  },
});

// For use when needed
// ts-unused-exports:disable-next-line
export const listSeparator = css({
  bg: 'accent.background-primary',
  color: 'accent.border-default',
  mx: '0px',
  my: 'space.03',
});
