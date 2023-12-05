import { styled } from 'leather-styles/jsx';

import { SvgProps } from '@app/ui/ui-types';

export function StxLedgerIcon({ size = 'md', ...props }: SvgProps) {
  return (
    <styled.svg
      width={size}
      height={size}
      viewBox="0 0 25 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M16.2091 14.89L20.2452 21H17.2301L12.492 13.8212L7.75399 21H4.75483L8.79093 14.906H3V12.5928H22V14.89H16.2091Z"
        fill="currentColor"
      />
      <path
        d="M22 8.03023V10.3434V10.3594H3V8.03023H8.67926L4.69102 2H7.70613L12.492 9.27456L17.2939 2H20.309L16.3207 8.03023H22Z"
        fill="currentColor"
      />
    </styled.svg>
  );
}
