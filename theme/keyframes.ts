import { CssKeyframes } from 'leather-styles/types/system-types';

// ts-unused-exports:disable-next-line
export const keyframes: CssKeyframes = {
  fadein: {
    '0%': { opacity: '0' },
    '100%': { opacity: '1' },
  },
  fadeout: {
    '0%': { opacity: '1' },
    '100%': { opacity: '0' },
  },
  shine: {
    '0%': {
      backgroundPosition: '-50px',
    },
    '100%': {
      backgroundPosition: '500px',
    },
  },
  rotate: {
    '0%': {
      transform: 'rotate(0deg)',
    },
    '100%': {
      transform: 'rotate(360deg)',
    },
  },
  // TODO: identical to above, remove
  spin: {
    '0%': {
      transform: 'rotate(0deg)',
    },
    '100%': {
      transform: 'rotate(360deg)',
    },
  },
  animatedTick: {
    from: {
      strokeDashoffset: 350,
    },
    to: {
      strokeDashoffset: 0,
    },
  },
};
