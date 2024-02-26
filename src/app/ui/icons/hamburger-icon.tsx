import { Icon, IconProps, IconSmall } from './icon/icon';

export function HamburgerIcon({ variant, ...props }: IconProps) {
  if (variant === 'small')
    return (
      <IconSmall {...props}>
        <path
          d="M1.8335 4.8335H14.1668M1.8335 11.1668H14.1668"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </IconSmall>
    );

  return (
    <Icon {...props}>
      <path
        d="M3 7H21M3 17H21"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Icon>
  );
}
