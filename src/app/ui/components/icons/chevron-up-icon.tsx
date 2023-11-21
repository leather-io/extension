import { Square, SquareProps } from 'leather-styles/jsx';

import { Svg } from '../svg';

export function ChevronUpIcon({ size = 'sm', ...props }: SquareProps) {
  return (
    <Square size={size} {...props}>
      <Svg
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g id="Chevron up">
          <path
            id="Vector"
            d="M12 10L8 6L4 10"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="square"
          />
        </g>
      </Svg>
    </Square>
  );
}
