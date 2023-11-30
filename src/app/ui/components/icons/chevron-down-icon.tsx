import { styled } from 'leather-styles/jsx';

import { SvgProps } from '@app/ui/ui-types';

export function ChevronDownIcon({ size = 'sm', ...props }: SvgProps) {
  return (
    <styled.svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path d="M4 6L8 10L12 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="square" />
    </styled.svg>
  );
}
