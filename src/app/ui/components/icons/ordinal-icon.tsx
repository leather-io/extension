import { Square, SquareProps } from 'leather-styles/jsx';
import { token } from 'leather-styles/tokens';

import { Svg } from '../svg';

export function OrdinalIcon({ size = token('icons.icon.xl'), ...props }: SquareProps) {
  return (
    <Square size={size} {...props}>
      <Svg
        xmlns="http://www.w3.org/2000/svg"
        width="40"
        height="40"
        viewBox="0 0 40 40"
        fill="none"
      >
        <circle cx="20" cy="20" r="20" fill="#0C0C0D" />
        <circle cx="20" cy="20" r="15" fill="white" />
        <circle cx="20" cy="20" r="7.5" fill="#0C0C0D" />
      </Svg>
    </Square>
  );
}
