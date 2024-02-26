import { Icon, IconProps, IconSmall } from './icon/icon';

export function LedgerIcon({ variant, ...props }: IconProps) {
  if (variant === 'small')
    return (
      <IconSmall {...props}>
        <path
          d="M0 11V15.0612L6 15L6 14H1V11H0ZM14 11L14 14H9V15L15 15.061L15 11H14ZM6 5V11H10L10 10H7V5H6ZM0 1V5H1L1 2H6L6 1H0ZM9 1L9 2H14L14 5H15L15 1H9Z"
          fill="currentColor"
        />
      </IconSmall>
    );

  return (
    <Icon {...props}>
      <path d="M15 14H11V8.5" stroke="currentColor" strokeWidth="2" />
      <path d="M20 8V4H14" stroke="currentColor" strokeWidth="2" />
      <path d="M20 15V19H14" stroke="currentColor" strokeWidth="2" />
      <path d="M4 8V4H10" stroke="currentColor" strokeWidth="2" />
      <path d="M4 15V19H10" stroke="currentColor" strokeWidth="2" />
    </Icon>
  );
}
