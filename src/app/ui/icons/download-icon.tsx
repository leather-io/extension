import { Icon, IconProps, IconSmall } from './icon/icon';

export function DownloadIcon({ variant, ...props }: IconProps) {
  if (variant === 'small')
    return (
      <IconSmall {...props}>
        <path
          d="M13.5 9.83333V12.8333C13.5 13.2015 13.2015 13.5 12.8333 13.5H3.16667C2.79848 13.5 2.5 13.2015 2.5 12.8333V9.83333M7.99999 10V2.5M7.99999 10L5.66667 7.66667M7.99999 10L10.3333 7.66667"
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
        d="M20 15V19C20 19.5523 19.5523 20 19 20H5C4.44772 20 4 19.5523 4 19V15M12 14.5V4M12 14.5L8.5 11M12 14.5L15.5 11"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Icon>
  );
}
