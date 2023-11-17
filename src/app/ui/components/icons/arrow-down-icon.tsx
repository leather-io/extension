import { Square, SquareProps } from 'leather-styles/jsx';
import { token } from 'leather-styles/tokens';

import { Svg } from '@app/ui/components/svg';

export function ArrowDownIcon({ size = token('icons.icon.sm'), ...props }: SquareProps) {
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
          d="M7.99992 3.33325V11.9999M3.33325 7.99992L7.99992 12.6666L12.6666 7.99992"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="square"
        />
      </Svg>
    </Square>
  );
}
