import { css } from 'leather-styles/css';

export const loadingStripedGradient = css({
  pos: 'relative',
  overflow: 'hidden',
  content: '""',
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundImage:
    'repeating-linear-gradient(45deg, #F07D12, #F07D12 16px, #FFB977 16px, #FFB977 32px)',
  animation: 'barberpole 30s linear infinite',
  backgroundSize: '193% 100%',
});
