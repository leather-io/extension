import { styled } from 'leather-styles/jsx';

import { SvgProps } from '@app/ui/ui-types';

export function AudioIcon({ size = 'sm', ...props }: SvgProps) {
  return (
    <styled.svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M9.9978 18.5C9.9978 19.8807 8.65466 21 6.9978 21C5.34095 21 3.9978 19.8807 3.9978 18.5C3.9978 17.1193 5.34095 16 6.9978 16C8.65466 16 9.9978 17.1193 9.9978 18.5ZM9.9978 18.5V6.74404C9.9978 6.30243 10.2875 5.91311 10.7105 5.78621L18.7105 3.38621C19.3521 3.19373 19.9978 3.67418 19.9978 4.34404V15.5M19.9978 15.5C19.9978 16.8807 18.6547 18 16.9978 18C15.3409 18 13.9978 16.8807 13.9978 15.5C13.9978 14.1193 15.3409 13 16.9978 13C18.6547 13 19.9978 14.1193 19.9978 15.5Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
    </styled.svg>
  );
}
