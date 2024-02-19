import { Icon, IconProps } from './icon/icon';

export function ListIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path
        d="M3 12H13M3 6H21M3 18H21"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Icon>
  );
}
