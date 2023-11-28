import { Square, SquareProps } from 'leather-styles/jsx';

import { Svg } from '../svg';

export function CircleIcon({ size = 'sm', ...props }: SquareProps) {
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
        <circle cx="12" cy="12" r="10"></circle>
      </Svg>
    </Square>
  );
}
