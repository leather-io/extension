import { Square, SquareProps } from 'leather-styles/jsx';

import { Svg } from '../svg';

export function HamburgerIcon({ size = 'sm', ...props }: SquareProps) {
  return (
    <Square size={size} {...props}>
      <Svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
      >
        <g clipPath="url(#clip0_5709_68606)">
          <path d="M0 5L16 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="square" />
          <path
            d="M6.05469 11L16.0547 11"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="square"
          />
        </g>
        <defs>
          <clipPath id="clip0_5709_68606">
            <rect width="16" height="16" fill="white" />
          </clipPath>
        </defs>
      </Svg>
    </Square>
  );
}
