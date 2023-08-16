import { css } from 'leaf-styles/css';

export const hideScrollbarClassName = css({
  '&::-webkit-scrollbar': {
    display: 'none',
  },
});
