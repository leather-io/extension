import { styled } from 'leather-styles/jsx';

import { SvgProps } from '@app/ui/ui-types';

export function SwapIcon({ size = 'sm', ...props }: SvgProps) {
  return (
    <styled.svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <g clipPath="url(#clip0_5842_83269)">
        <path
          d="M1.94727 4.50229H13.2596M10.7086 7.59746L13.7987 4.50229L10.7086 1.41211M13.9934 11.4964H2.756M5.30702 8.4012L2.21185 11.4964L5.30702 14.5865"
          stroke="currentColor"
          strokeWidth="2"
          strokeMiterlimit="10"
        />
      </g>
      <defs>
        <clipPath id="clip0_5842_83269">
          <rect width="16" height="16" fill="white" />
        </clipPath>
      </defs>
    </styled.svg>
  );
}
