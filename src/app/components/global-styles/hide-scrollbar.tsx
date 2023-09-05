import { css } from 'leather-styles/css';

export const hideScrollbarClassName = css({
  '&::-webkit-scrollbar': {
    display: 'none',
  },
});
