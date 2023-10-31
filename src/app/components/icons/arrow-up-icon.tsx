import { Square, SquareProps } from 'leather-styles/jsx';

import { Svg } from '@app/ui/components/svg';

export function ArrowUpIcon({ size = '16px', ...props }: SquareProps) {
  return (
    <Square size={size} {...props}>
      <Svg
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M7.99508 12.6634V3.99674M3.33008 7.99674L7.99508 3.33008L12.6601 7.99674"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="square"
        />
      </Svg>
    </Square>
  );
}
