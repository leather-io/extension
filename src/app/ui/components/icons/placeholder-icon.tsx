import { styled } from 'leather-styles/jsx';

import { SvgProps } from '@app/ui/ui-types';

export function PlaceholderIcon({ size = 'md', ...props }: SvgProps) {
  return (
    <styled.svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      {...props}
    >
      <path
        d="M4 6V5C4 4.44772 4.44772 4 5 4H6M18 4H19C19.5523 4 20 4.44772 20 5V6M20 18V19C20 19.5523 19.5523 20 19 20H18M6 20H5C4.44772 20 4 19.5523 4 19V18M4 13.5V10.5M10.5 4H13.5M20 10.5V13.5M13.5 20H10.5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </styled.svg>
  );
}
