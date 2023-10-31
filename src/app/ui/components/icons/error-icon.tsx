import { Square, SquareProps } from 'leather-styles/jsx';
import { token } from 'leather-styles/tokens';

import { Svg } from '../svg';

export function ErrorIcon({ size = token('icons.icon.sm'), ...props }: SquareProps) {
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
          d="M6.86001 2.57335L1.21335 12C1.09693 12.2016 1.03533 12.4302 1.03467 12.663C1.03402 12.8958 1.09434 13.1248 1.20963 13.327C1.32492 13.5293 1.49116 13.6978 1.69182 13.8159C1.89247 13.934 2.12055 13.9975 2.35335 14H13.6467C13.8795 13.9975 14.1076 13.934 14.3082 13.8159C14.5089 13.6978 14.6751 13.5293 14.7904 13.327C14.9057 13.1248 14.966 12.8958 14.9654 12.663C14.9647 12.4302 14.9031 12.2016 14.7867 12L9.14001 2.57335C9.02117 2.37742 8.85383 2.21543 8.65414 2.103C8.45446 1.99058 8.22917 1.93152 8.00001 1.93152C7.77086 1.93152 7.54557 1.99058 7.34588 2.103C7.1462 2.21543 6.97886 2.37742 6.86001 2.57335Z"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="square"
        />
        <path d="M8 6V8.66667" stroke="currentColor" strokeWidth="1.8" strokeLinecap="square" />
        <path
          d="M8 11.3334H8.00667"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="square"
        />
      </Svg>
    </Square>
  );
}
