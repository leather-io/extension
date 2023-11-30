import { styled } from 'leather-styles/jsx';

import { SvgProps } from '@app/ui/ui-types';

export function EyeIcon({ size = 'sm', ...props }: SvgProps) {
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
        d="M1 8C1 8 3.54545 3 8 3C12.4545 3 15 8 15 8C15 8 12.4545 13 8 13C3.54545 13 1 8 1 8Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="square"
        strokeLinejoin="round"
      />
      <path
        d="M8.00003 9.87512C9.05439 9.87512 9.90912 9.03566 9.90912 8.00012C9.90912 6.96459 9.05439 6.12512 8.00003 6.12512C6.94567 6.12512 6.09094 6.96459 6.09094 8.00012C6.09094 9.03566 6.94567 9.87512 8.00003 9.87512Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="square"
      />
    </styled.svg>
  );
}
