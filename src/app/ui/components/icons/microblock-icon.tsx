import { FiZap } from 'react-icons/fi';

import { Square, SquareProps } from 'leather-styles/jsx';
import { token } from 'leather-styles/tokens';

export function MicroblockIcon({ size = 'xs', ...props }: SquareProps) {
  return (
    <Square size={size} {...props}>
      {/* TODO: Replace Fi icon here */}
      <FiZap fill={token('colors.accent.background-primary')} />
    </Square>
  );
}
