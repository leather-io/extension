import { styled } from 'leather-styles/jsx';

import { SvgProps } from '@app/ui/ui-types';

export function OrdinalIcon({ size = 'xl', ...props }: SvgProps) {
  return (
    <styled.svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      {...props}
    >
      <circle cx="20" cy="20" r="20" fill="#0C0C0D" />
      <circle cx="20" cy="20" r="15" fill="white" />
      <circle cx="20" cy="20" r="7.5" fill="#0C0C0D" />
    </styled.svg>
  );
}
