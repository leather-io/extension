import { Square, SquareProps } from 'leather-styles/jsx';
import { token } from 'leather-styles/tokens';

import { Svg } from '../svg';

export function QrCodeIcon({ size = token('icons.icon.sm'), ...props }: SquareProps) {
  return (
    <Square size={size} {...props}>
      <Svg
        fill="none"
        height="16"
        viewBox="0 0 16 16"
        width="16"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g stroke="currentColor" strokeLinecap="square" strokeWidth="1.8">
          <path d="m6.66667 2h-4.66667v4.66667h4.66667z" />
          <path d="m13.9999 2h-4.66665v4.66667h4.66665z" />
          <path d="m10.3333 9.33325h-1.00005v1.00005h1.00005z" />
          <path d="m10.3333 13h-1.00005v1h1.00005z" />
          <path d="m14 9.33325h-1v1.00005h1z" />
          <path d="m14 13h-1v1h1z" />
          <path d="m6.66667 9.33325h-4.66667v4.66665h4.66667z" />
        </g>
      </Svg>
    </Square>
  );
}
