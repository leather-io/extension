import { styled } from 'leather-styles/jsx';

import { SvgProps } from '@app/ui/ui-types';

export function PlusIcon({ size = 'sm', ...props }: SvgProps) {
  return (
    <styled.svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path d="M8 3.33301V12.6663" stroke="currentColor" strokeWidth="1.8" strokeLinecap="square" />
      <path d="M3.33301 8H12.6663" stroke="currentColor" strokeWidth="1.8" strokeLinecap="square" />
    </styled.svg>
  );
}
