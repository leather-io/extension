import { Icon, IconProps } from './icon/icon';

export function InboxIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path
        d="M4.00002 13L4 20H20V13M4.00002 13L4.00005 4.00001L20 4V13M4.00002 13H8.12602C8.57006 14.7252 10.1362 16 12 16C13.8638 16 15.4299 14.7252 15.874 13H20"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="square"
        strokeLinejoin="round"
      />
    </Icon>
  );
}
