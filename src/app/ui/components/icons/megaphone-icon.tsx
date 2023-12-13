import { styled } from 'leather-styles/jsx';

import { SvgProps } from '@app/ui/ui-types';

export function MegaphoneIcon({ size = 'sm', ...props }: SvgProps) {
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
        d="M12.1652 9.33339C13.2698 9.33339 14.1652 8.43796 14.1652 7.33339C14.1652 6.22882 13.2698 5.33339 12.1652 5.33339M8.38477 12.1667C8.11021 12.9435 7.36939 13.5001 6.49858 13.5001C5.39401 13.5001 4.49858 12.6046 4.49858 11.5001V10.5001M4.50004 4.16672V10.5001M12.1652 2.73695V11.9298C12.1652 12.3786 11.7307 12.6992 11.3019 12.5668L2.3019 9.78803C2.02248 9.70175 1.83191 9.44346 1.83191 9.15103L1.83191 5.51575C1.83191 5.22332 2.02248 4.96502 2.3019 4.87875L11.3019 2.09995C11.7307 1.96755 12.1652 2.28814 12.1652 2.73695Z"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="1.5"
      />
    </styled.svg>
  );
}
