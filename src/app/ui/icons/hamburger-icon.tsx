import { Icon, IconProps } from './icon/icon';

export function HamburgerIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path
        d="M3 7H21M3 17H21"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Icon>
  );
}
