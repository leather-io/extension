import type { SystemStyleObject } from 'leather-styles/types';

export const shimmerStyles: SystemStyleObject = {
  '&[data-state=loading]': {
    display: 'inline-block',
    WebkitMask: 'linear-gradient(-60deg, #000 30%, #0005, #000 70%) right/300% 100%',
    backgroundRepeat: 'no-repeat',
    animation: 'shimmer 1.5s infinite',
    color: 'ink.text-subdued',
  },
};
