import { Square, SquareProps } from 'leather-styles/jsx';

import { Svg } from '../svg';

export function RotateLeftIcon({ size = 'sm', ...props }: SquareProps) {
  return (
    <Square size={size} {...props}>
      <Svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="square"
        strokeLinejoin="arcs"
      >
        <path d="M2.5 2v6h6M2.66 15.57a10 10 0 1 0 .57-8.38" />
      </Svg>
    </Square>
  );
}
