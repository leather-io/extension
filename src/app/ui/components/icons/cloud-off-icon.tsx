import { styled } from 'leather-styles/jsx';

import { SvgProps } from '@app/ui/ui-types';

// TODO: This svg was copied from react-icons temporarily
export function CloudOffIcon({ size = 'sm', ...props }: SvgProps) {
  return (
    <styled.svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      stroke="currentColor"
      strokeWidth="2"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M22.61 16.95A5 5 0 0 0 18 10h-1.26a8 8 0 0 0-7.05-6M5 5a8 8 0 0 0 4 15h9a5 5 0 0 0 1.7-.3"></path>
      <line x1="1" y1="1" x2="23" y2="23"></line>
    </styled.svg>
  );
}
