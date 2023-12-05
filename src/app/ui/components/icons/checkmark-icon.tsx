import { styled } from 'leather-styles/jsx';

import { SvgProps } from '@app/ui/ui-types';

export function CheckmarkIcon({ size = 'sm', ...props }: SvgProps) {
  return (
    <styled.svg
      width={size}
      height={size}
      viewBox="0 0 16 17"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M13.3327 4.2168L5.99935 11.5501L2.66602 8.2168"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="square"
      />
    </styled.svg>
  );
}
