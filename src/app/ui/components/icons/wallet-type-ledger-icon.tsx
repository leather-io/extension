import { styled } from 'leather-styles/jsx';

import { SvgProps } from '@app/ui/ui-types';

export function WalletTypeLedgerIcon({ size = 'md', ...props }: SvgProps) {
  return (
    <styled.svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <rect width="24" height="24" rx="6" fill="#EFEFEF" />
      <path
        d="M6 15.5V17.9999H10"
        stroke="#242629"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M18 15.5V17.9999H14"
        stroke="#242629"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M6 8.49988V5.99996H10"
        stroke="#242629"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M13.5 14L11.0001 14L11.0001 10"
        stroke="#242629"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M18 8.49988V5.99996H14"
        stroke="#242629"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </styled.svg>
  );
}
