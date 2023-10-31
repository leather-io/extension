import { Square, SquareProps } from 'leather-styles/jsx';

import { Svg } from '@app/ui/components/svg';

export function CheckmarkIcon({ size = '16px', ...props }: SquareProps) {
  return (
    <Square size={size} {...props}>
      <Svg
        width="16"
        height="17"
        viewBox="0 0 16 17"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M13.3327 4.2168L5.99935 11.5501L2.66602 8.2168"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="square"
        />
      </Svg>
    </Square>
  );
}
