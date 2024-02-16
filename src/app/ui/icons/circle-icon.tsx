import { Icon, IconProps, IconSmall } from './icon/icon';

export function CircleIcon({ variant, ...props }: IconProps) {
  if (variant === 'small')
    return (
      <IconSmall {...props}>
        <circle
          cx="8.00016"
          cy="7.99992"
          r="6.16667"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="square"
        />
      </IconSmall>
    );

  return (
    <Icon {...props}>
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" />
    </Icon>
  );
}
