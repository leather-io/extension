import { styled } from 'leather-styles/jsx';

import { SvgProps } from '@app/ui/ui-types';

export function ChevronsRightIcon({ size = 'sm', ...props }: SvgProps) {
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
      <path d="M13 17l5-5-5-5M6 17l5-5-5-5" />
    </styled.svg>
  );
}
