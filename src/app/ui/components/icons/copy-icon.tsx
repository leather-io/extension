import { styled } from 'leather-styles/jsx';

import { SvgProps } from '@app/ui/ui-types';

export function CopyIcon({ size = 'sm', ...props }: SvgProps) {
  return (
    <styled.svg
      fill="none"
      width={size}
      height={size}
      viewBox="0 0 16 16"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <clipPath id="a">
        <path d="m0 0h16v16h-16z" />
      </clipPath>
      <g clipPath="url(#a)" stroke="currentColor" strokeLinecap="square" strokeWidth="1.8">
        <path d="m14.4999 6h-8.49985l-.00005 8.6667h8.6666z" />
        <path d="m3.33325 10h-2v-8.66663h8.66667v2" />
      </g>
    </styled.svg>
  );
}
