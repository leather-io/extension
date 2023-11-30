import { styled } from 'leather-styles/jsx';

import { SvgProps } from '@app/ui/ui-types';

export function ArrowUpIcon({ size = 'sm', ...props }: SvgProps) {
  return (
    <styled.svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M7.99508 12.6634V3.99674M3.33008 7.99674L7.99508 3.33008L12.6601 7.99674"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="square"
      />
    </styled.svg>
  );
}
