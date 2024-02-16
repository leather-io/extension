import { Icon, IconProps, IconSmall } from './icon/icon';

export function InfoCircleIcon({ variant, ...props }: IconProps) {
  if (variant === 'small')
    return (
      <IconSmall {...props}>
        <path
          d="M7.16683 7.33325H8.00016L8.00016 10.8333M14.1668 7.99992C14.1668 11.4057 11.4059 14.1666 8.00016 14.1666C4.59441 14.1666 1.8335 11.4057 1.8335 7.99992C1.8335 4.59416 4.59441 1.83325 8.00016 1.83325C11.4059 1.83325 14.1668 4.59416 14.1668 7.99992Z"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <rect
          x="7.5415"
          y="4.875"
          width="0.916667"
          height="0.916667"
          rx="0.458333"
          fill="currentColor"
          stroke="currentColor"
          strokeWidth="0.25"
        />
      </IconSmall>
    );

  return (
    <Icon {...props}>
      <path
        d="M11 11H12V16M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <rect
        x="11.25"
        y="7.25"
        width="1.5"
        height="1.5"
        rx="0.75"
        fill="currentColor"
        stroke="currentColor"
        strokeWidth="0.5"
      />
    </Icon>
  );
}
