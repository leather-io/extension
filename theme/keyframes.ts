import { CssKeyframes } from 'leaf-styles/types/system-types';

// ts-unused-exports:disable-next-line
export const keyframes: CssKeyframes = {
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
};
