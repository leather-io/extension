import { Square, SquareProps } from 'leather-styles/jsx';
import { token } from 'leather-styles/tokens';

import { Svg } from '@app/ui/components/svg';

export function CodeIcon({ size = token('icons.icon.sm'), ...props }: SquareProps) {
  return (
    <Square size={size} {...props}>
      <Svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
      >
        <path
          d="M10.6667 12L14.6667 8L10.6667 4"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="square"
        />
        <path
          d="M5.33325 4L1.33325 8L5.33325 12"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="square"
        />
      </Svg>
    </Square>
  );
}
