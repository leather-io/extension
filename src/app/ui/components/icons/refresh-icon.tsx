import { Square, SquareProps } from 'leather-styles/jsx';
import { token } from 'leather-styles/tokens';

import { Svg } from '../svg';

export function RefreshIcon({ size = token('icons.icon.sm'), ...props }: SquareProps) {
  return (
    <Square size={size} {...props}>
      <Svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
      >
        <g clipPath="url(#clip0_1645_1877)">
          <path
            d="M1.66675 1.3335V5.3335H5.66675M14.3334 14.6668V10.6668H10.3334"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="square"
          />
          <path
            d="M14.6666 7.66651C14.6034 6.20751 14.063 4.80961 13.1282 3.68759C12.1935 2.56558 10.9162 1.78153 9.49259 1.45592C8.06899 1.1303 6.57785 1.28115 5.2483 1.88527C3.91875 2.48939 2.82435 3.51336 2.13325 4.79984M1.33325 8.33318C1.40955 9.78683 1.95954 11.1756 2.89921 12.2873C3.83888 13.399 5.11659 14.1726 6.53722 14.49C7.95785 14.8074 9.44332 14.6511 10.7668 14.0449C12.0902 13.4388 13.1789 12.4162 13.8666 11.1332"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="square"
          />
        </g>
        <defs>
          <clipPath id="clip0_1645_1877">
            <rect width="16" height="16" fill="white" transform="matrix(-1 0 0 1 16 0)" />
          </clipPath>
        </defs>
      </Svg>
    </Square>
  );
}
