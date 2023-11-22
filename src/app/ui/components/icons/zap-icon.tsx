import { Square, SquareProps } from 'leather-styles/jsx';

import { Svg } from '../svg';

// TODO: This svg was copied from react-icons temporarily
export function ZapIcon({ size = 'sm', ...props }: SquareProps) {
  return (
    <Square size={size} {...props}>
      <Svg
        viewBox="0 0 24 24"
        width="24"
        height="24"
        stroke="currentColor"
        strokeWidth="2"
        fill={props.fill ?? 'none'}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
      </Svg>
    </Square>
  );
}
