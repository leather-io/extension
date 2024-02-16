import { Icon, IconProps, IconSmall } from './icon/icon';

export function RefreshIcon({ variant, ...props }: IconProps) {
  if (variant === 'small')
    return (
      <IconSmall {...props}>
        <path
          d="M12.8412 2.5V4.83333C12.8412 5.01743 12.692 5.16667 12.5079 5.16667H10.1746M3.16667 13.5V11.1667C3.16667 10.9826 3.31591 10.8333 3.5 10.8333H5.83333M2.54255 8.6875C2.51447 8.46228 2.5 8.23283 2.5 8C2.5 4.96243 4.96243 2.5 8 2.5C9.78439 2.5 11.4074 3.34975 12.4214 4.66667M13.4574 7.3125C13.4855 7.53772 13.5 7.76717 13.5 8C13.5 11.0376 11.0376 13.5 8 13.5C6.21561 13.5 4.59258 12.6502 3.57856 11.3333"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </IconSmall>
    );

  return (
    <Icon {...props}>
      <path
        d="M5 20V16.5C5 16.2239 5.22386 16 5.5 16H8.75M19.0118 4V7.5C19.0118 7.77614 18.788 8 18.5118 8H15.0118M4 12C4 7.58172 7.58172 4 12 4C14.6362 4 17.0303 5.27512 18.5 7.24224M20 12C20 16.4183 16.4183 20 12 20C9.36378 20 6.96969 18.7249 5.5 16.7578"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Icon>
  );
}
