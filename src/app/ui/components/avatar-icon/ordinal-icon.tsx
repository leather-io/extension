import { styled } from 'leather-styles/jsx';

import { IconProps } from '../../icons/icon/icon';

// TODO: Will refactor with AvatarIcons, issue #4884
export function OrdinalIcon({ width = 'xl', ...props }: IconProps) {
  return (
    <styled.svg
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height="auto"
      viewBox="0 0 40 40"
      fill="none"
      {...props}
    >
      <circle cx="20" cy="20" r="20" fill="#0C0C0D" />
      <circle cx="20" cy="20" r="15" fill="white" />
      <circle cx="20" cy="20" r="7.5" fill="#0C0C0D" />
    </styled.svg>
  );
}
