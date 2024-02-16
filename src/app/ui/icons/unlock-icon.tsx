import { Icon, IconProps, IconSmall } from './icon/icon';

export function UnlockIcon({ variant, ...props }: IconProps) {
  if (variant === 'small')
    return (
      <IconSmall {...props}>
        <path
          d="M7.99984 9.3335V11.3335M5.1665 6.50016V4.66683C5.1665 3.10202 6.43503 1.8335 7.99984 1.8335C9.3949 1.8335 10.5545 2.84174 10.7896 4.1693M3.83317 14.1668H12.1665C12.5347 14.1668 12.8332 13.8684 12.8332 13.5002V7.16683C12.8332 6.79864 12.5347 6.50016 12.1665 6.50016H3.83317C3.46498 6.50016 3.1665 6.79864 3.1665 7.16683V13.5002C3.1665 13.8684 3.46498 14.1668 3.83317 14.1668Z"
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
        d="M12 14V17M8 10V7C8 4.79086 9.79086 3 12 3C13.8638 3 15.4299 4.27477 15.874 6M6 21H18C18.5523 21 19 20.5523 19 20V11C19 10.4477 18.5523 10 18 10H6C5.44772 10 5 10.4477 5 11V20C5 20.5523 5.44772 21 6 21Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Icon>
  );
}
