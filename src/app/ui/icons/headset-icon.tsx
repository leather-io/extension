import { Icon, IconProps, IconSmall } from './icon/icon';

export function HeadsetIcon({ variant, ...props }: IconProps) {
  if (variant === 'small')
    return (
      <IconSmall {...props}>
        <path
          d="M2.6665 9.33317V7.99984C2.6665 5.05432 5.05432 2.6665 7.99984 2.6665C10.9454 2.6665 13.3332 5.05432 13.3332 7.99984V9.33317M2.6665 9.33317V12.6665C2.6665 13.0347 2.96498 13.3332 3.33317 13.3332H4.6665C5.03469 13.3332 5.33317 13.0347 5.33317 12.6665V9.99984C5.33317 9.63165 5.03469 9.33317 4.6665 9.33317H2.6665ZM13.3332 9.33317V12.6665C13.3332 13.0347 13.0347 13.3332 12.6665 13.3332H11.3332C10.965 13.3332 10.6665 13.0347 10.6665 12.6665V9.99984C10.6665 9.63165 10.965 9.33317 11.3332 9.33317H13.3332Z"
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
        d="M4 14V12C4 7.58172 7.58172 4 12 4C16.4183 4 20 7.58172 20 12V14M4 14V19C4 19.5523 4.44772 20 5 20H7C7.55228 20 8 19.5523 8 19V15C8 14.4477 7.55228 14 7 14H4ZM20 14V19C20 19.5523 19.5523 20 19 20H17C16.4477 20 16 19.5523 16 19V15C16 14.4477 16.4477 14 17 14H20Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="square"
        strokeLinejoin="round"
      />
    </Icon>
  );
}
