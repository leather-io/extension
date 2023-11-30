import { styled } from 'leather-styles/jsx';

import { SvgProps } from '@app/ui/ui-types';

// TODO: This svg was copied from react-icons temporarily
export function ZapIcon({ size = 'sm', ...props }: SvgProps) {
  return (
    <styled.svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      stroke="currentColor"
      strokeWidth="2"
      fill={props.fill ?? 'none'}
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
    </styled.svg>
  );
}
