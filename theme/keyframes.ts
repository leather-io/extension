import { keyframes as leatherKeyframes } from '@leather-wallet/tokens';
import { CssKeyframes } from 'leather-styles/types/system-types';

// ts-unused-exports:disable-next-line
export const keyframes: CssKeyframes = {
  ...leatherKeyframes,
  slideDownAndOut: {
    from: { opacity: 1, transform: 'translateY(0)' },
    to: { opacity: 0, transform: 'translateY(4px)' },
  },
  toastAppear: {
    from: { opacity: 0, transform: 'translateY(-12px) scale(0.9)' },
    to: { opacity: 1, transform: 'translateY(0) scale(1)' },
  },
  shimmer: {
    '100%': {
      maskPosition: 'left',
    },
  },
  barberpole: {
    '0%': {
      backgroundPosition: '300% 0',
    },
    '100%': {
      backgroundPosition: '0 0',
    },
  },
};
