import { Icon, IconProps, IconSmall } from './icon/icon';

export function InboxIcon({ variant, ...props }: IconProps) {
  if (variant === 'small')
    return (
      <IconSmall {...props}>
        <path
          d="M2.5 8.5H5.38013C5.61417 9.73377 6.69814 10.6667 8 10.6667C9.30186 10.6667 10.3858 9.73376 10.6199 8.5L13.5 8.5M2.5 13.5H13.5V2.5L2.50003 2.5L2.5 13.5Z"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="square"
          strokeLinejoin="round"
        />
      </IconSmall>
    );

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
