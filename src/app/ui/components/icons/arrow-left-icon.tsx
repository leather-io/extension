import { Square, SquareProps } from 'leather-styles/jsx';

import { Svg } from '../svg';

export function ArrowLeftIcon({ size = 'sm', ...props }: SquareProps) {
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
          d="M12.6666 7.99992H3.99992M7.99992 3.33325L3.33325 7.99992L7.99992 12.6666"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="square"
        />
      </Svg>
    </Square>
  );
}
