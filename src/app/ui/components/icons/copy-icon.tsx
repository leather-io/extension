import { Square, SquareProps } from 'leather-styles/jsx';

import { Svg } from '../svg';

export function CopyIcon({ size = 'sm', ...props }: SquareProps) {
  return (
    <Square size={size} {...props}>
      <Svg
        fill="none"
        height="16"
        viewBox="0 0 16 16"
        width="16"
        xmlns="http://www.w3.org/2000/svg"
      >
        <clipPath id="a">
          <path d="m0 0h16v16h-16z" />
        </clipPath>
        <g clipPath="url(#a)" stroke="currentColor" strokeLinecap="square" strokeWidth="1.8">
          <path d="m14.4999 6h-8.49985l-.00005 8.6667h8.6666z" />
          <path d="m3.33325 10h-2v-8.66663h8.66667v2" />
        </g>
      </Svg>
    </Square>
  );
}
