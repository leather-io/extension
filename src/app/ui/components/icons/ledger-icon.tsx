import { styled } from 'leather-styles/jsx';

import { SvgProps } from '@app/ui/ui-types';

export function LedgerIcon({ size = 'sm', ...props }: SvgProps) {
  return (
    <styled.svg
      width={size}
      height={size}
      viewBox="0 0 15 15"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M0 10V14.0612L6 14L6 13H1V10H0ZM14 10L14 13H9V14L15 14.061L15 10H14ZM6 4V10H10L10 9H7V4H6ZM0 0V4H1L1 1H6L6 0H0ZM9 0L9 1H14L14 4H15L15 0H9Z"
        fill="currentColor"
      />
    </styled.svg>
  );
}
