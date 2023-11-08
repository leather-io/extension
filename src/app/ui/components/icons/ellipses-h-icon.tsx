import { Square, SquareProps } from 'leather-styles/jsx';
import { token } from 'leather-styles/tokens';

import { Svg } from '@app/ui/components/svg';

export function EllipsesHorizontalIcon({ size = token('icons.icon.sm'), ...props }: SquareProps) {
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
          d="M8.00004 8.66659C8.36823 8.66659 8.66671 8.36811 8.66671 7.99992C8.66671 7.63173 8.36823 7.33325 8.00004 7.33325C7.63185 7.33325 7.33337 7.63173 7.33337 7.99992C7.33337 8.36811 7.63185 8.66659 8.00004 8.66659Z"
          fill="currentColor"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="square"
        />
        <path
          d="M12.6667 8.66659C13.0349 8.66659 13.3333 8.36811 13.3333 7.99992C13.3333 7.63173 13.0349 7.33325 12.6667 7.33325C12.2985 7.33325 12 7.63173 12 7.99992C12 8.36811 12.2985 8.66659 12.6667 8.66659Z"
          fill="currentColor"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="square"
        />
        <path
          d="M3.33329 8.66659C3.70148 8.66659 3.99996 8.36811 3.99996 7.99992C3.99996 7.63173 3.70148 7.33325 3.33329 7.33325C2.9651 7.33325 2.66663 7.63173 2.66663 7.99992C2.66663 8.36811 2.9651 8.66659 3.33329 8.66659Z"
          fill="currentColor"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="square"
        />
      </Svg>
    </Square>
  );
}
