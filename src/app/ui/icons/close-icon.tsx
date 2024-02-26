import { Icon, IconProps, IconSmall } from './icon/icon';

export function CloseIcon({ variant, ...props }: IconProps) {
  if (variant === 'small')
    return (
      <IconSmall {...props}>
        <path
          d="M3.1665 3.16675L12.8332 12.8334M12.8332 3.16675L3.1665 12.8334"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </IconSmall>
    );

  return (
    <Icon {...props}>
      <path d="M5 5L19 19M19 5L5 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </Icon>
  );
}
