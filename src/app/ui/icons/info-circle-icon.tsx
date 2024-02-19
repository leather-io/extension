import { Icon, IconProps } from './icon/icon';

export function InfoCircleIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path
        d="M11 11H12V16M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <rect
        x="11.25"
        y="7.25"
        width="1.5"
        height="1.5"
        rx="0.75"
        fill="currentColor"
        stroke="currentColor"
        strokeWidth="0.5"
      />
    </Icon>
  );
}
