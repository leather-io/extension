import { Icon, IconProps } from './icon/icon';

export function ExpandIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path
        d="M6 13V17C6 17.5523 6.44772 18 7 18H11M13 6H17C17.5523 6 18 6.44772 18 7V11"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Icon>
  );
}
