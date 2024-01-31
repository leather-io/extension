import { Icon, IconProps } from './icon/icon';

export function ErrorCircleIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <rect x="10.75" y="14.75" width="2.5" height="2.5" rx="1.25" fill="currentColor" />
      <path
        d="M11.9967 7.625V12.5M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Icon>
  );
}
