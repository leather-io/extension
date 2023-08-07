import { css } from 'leaf-styles/css';

export const hideScrollbarStyle = css({
  '&::-webkit-scrollbar': {
    display: 'none',
  },
});
