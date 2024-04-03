import { css } from 'leather-styles/css';

export const loadingStripedGradient = css({
  pos: 'relative',
  overflow: 'hidden',
  _before: {
    content: '""',
    position: 'absolute',
    width: '500px',
    height: '500px',
    backgroundImage:
      'repeating-linear-gradient(45deg, #F07D12, #F07D12 16px, #FFB977 16px, #FFB977 32px)',
    animation: 'barberpole 40s linear infinite',
    backgroundSize: '193% 100%',
  },
});
