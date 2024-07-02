import { breakpoints, tokens } from '@leather.io/tokens';

export const customViewports = {
  popup: {
    name: 'Popup',
    styles: {
      width: tokens.sizes.popupWidth.value,
      height: tokens.sizes.popupHeight.value,
    },
  },
  sm: {
    name: 'sm',
    styles: {
      width: breakpoints.sm,
      height: '100%',
    },
  },
  md: {
    name: 'md',
    styles: {
      width: breakpoints.md,
      height: '100%',
    },
  },
  lg: {
    name: 'lg',
    styles: {
      width: breakpoints.lg,
      height: '100%',
    },
  },
  xl: {
    name: 'xl',
    styles: {
      width: breakpoints.xl,
      height: '100%',
    },
  },
  '2xl': {
    name: '2xl',
    styles: {
      width: breakpoints['2xl'],
      height: '100%',
    },
  },
};
