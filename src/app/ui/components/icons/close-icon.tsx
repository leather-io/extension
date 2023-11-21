import { Square, SquareProps } from 'leather-styles/jsx';

import { Svg } from '../svg';

export function CloseIcon({ size = 'sm', ...props }: SquareProps) {
  return (
    <Square size={size} {...props}>
      <Svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
      >
        <path d="M12 4L4 12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="square" />
        <path d="M4 4L12 12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="square" />
      </Svg>
    </Square>
  );
}
