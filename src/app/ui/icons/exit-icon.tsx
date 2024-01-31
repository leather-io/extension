import { Icon, IconProps } from './icon/icon';

export function ExitIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path
        d="M11.25 20H5C4.44772 20 4 19.5523 4 19L4 5C4 4.44772 4.44772 4 5 4L11.25 4M20 12L8.75 12M20 12L15.5 16.5M20 12L15.5 7.5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Icon>
  );
}
