import { styled } from 'leather-styles/jsx';

import { SvgProps } from '@app/ui/ui-types';

export function UnlockIcon({ size = 'sm', ...props }: SvgProps) {
  return (
    <styled.svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill="none"
      {...props}
    >
      <rect
        x="2"
        y="8"
        width="12"
        height="7"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="square"
      />
      <path
        d="M4.66663 7.33325V4.66659C4.66663 3.78253 5.01782 2.93468 5.64294 2.30956C6.26806 1.68444 7.1159 1.33325 7.99996 1.33325C8.88401 1.33325 9.73186 1.68444 10.357 2.30956"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="square"
      />
    </styled.svg>
  );
}
