import { styled } from 'leather-styles/jsx';

import { SvgProps } from '@app/ui/ui-types';

export function ArrowLeftIcon({ size = 'sm', ...props }: SvgProps) {
  return (
    <styled.svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill="none"
      {...props}
    >
      <path
        d="M12.6666 7.99992H3.99992M7.99992 3.33325L3.33325 7.99992L7.99992 12.6666"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="square"
      />
    </styled.svg>
  );
}
