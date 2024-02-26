import { Icon, IconProps, IconSmall } from './icon/icon';

export function LockIcon({ variant, ...props }: IconProps) {
  if (variant === 'small')
    return (
      <IconSmall {...props}>
        <path
          d="M10.8332 6.5V4.83333C10.8332 3.26853 9.56464 2 7.99984 2C6.43503 2 5.1665 3.26853 5.1665 4.83333V6.5M7.99984 9.33333V11.3333M3.83317 14.1667H12.1665C12.5347 14.1667 12.8332 13.8682 12.8332 13.5V7.16667C12.8332 6.79848 12.5347 6.5 12.1665 6.5H3.83317C3.46498 6.5 3.1665 6.79848 3.1665 7.16667V13.5C3.1665 13.8682 3.46498 14.1667 3.83317 14.1667Z"
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
        d="M16 10V7C16 4.79086 14.2091 3 12 3C9.79086 3 8 4.79086 8 7V10M12 14V17M6 21H18C18.5523 21 19 20.5523 19 20V11C19 10.4477 18.5523 10 18 10H6C5.44772 10 5 10.4477 5 11V20C5 20.5523 5.44772 21 6 21Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Icon>
  );
}
