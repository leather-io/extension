import { styled } from 'leather-styles/jsx';

import { SvgProps } from '@app/ui/ui-types';

export function CircleIcon({ size = 'sm', ...props }: SvgProps) {
  return (
    <styled.svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="square"
      strokeLinejoin="arcs"
      {...props}
    >
      <circle cx="12" cy="12" r="10"></circle>
    </styled.svg>
  );
}
