import { styled } from 'leather-styles/jsx';

import { SvgProps } from '@app/ui/ui-types';

export function ChevronUpIcon({ size = 'sm', ...props }: SvgProps) {
  return (
    <styled.svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <g id="Chevron up">
        <path
          id="Vector"
          d="M12 10L8 6L4 10"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="square"
        />
      </g>
    </styled.svg>
  );
}
