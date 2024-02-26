import { Icon, IconProps, IconSmall } from './icon/icon';

export function ExpandIcon({ variant, ...props }: IconProps) {
  if (variant === 'small')
    return (
      <IconSmall {...props}>
        <path
          d="M4 8.66667V11.3333C4 11.7015 4.29848 12 4.66667 12H7.33333M8.66667 4H11.3333C11.7015 4 12 4.29848 12 4.66667V7.33333"
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
        d="M6 13V17C6 17.5523 6.44772 18 7 18H11M13 6H17C17.5523 6 18 6.44772 18 7V11"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Icon>
  );
}
