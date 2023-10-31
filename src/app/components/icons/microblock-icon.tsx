import { FiZap } from 'react-icons/fi';

import { Square, SquareProps } from 'leather-styles/jsx';
import { token } from 'leather-styles/tokens';

export function MicroblockIcon({ size = '13px', ...props }: SquareProps) {
  return (
    <Square size={size} {...props}>
      <FiZap fill={token('colors.accent.background-primary')} />
    </Square>
  );
}
