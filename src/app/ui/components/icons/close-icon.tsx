import { styled } from 'leather-styles/jsx';

import { SvgProps } from '@app/ui/ui-types';

export function CloseIcon({ size = 'sm', ...props }: SvgProps) {
  return (
    <styled.svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill="none"
      {...props}
    >
      <path d="M12 4L4 12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="square" />
      <path d="M4 4L12 12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="square" />
    </styled.svg>
  );
}
