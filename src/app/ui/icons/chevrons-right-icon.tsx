import { Icon, IconProps, IconSmall } from './icon/icon';

export function ChevronsRightIcon({ variant, ...props }: IconProps) {
  if (variant === 'small')
    return (
      <IconSmall {...props}>
        <path
          d="M9 5L11.8842 7.73484C12.0386 7.88128 12.0386 8.11872 11.8842 8.26516L9 11"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M4 5L6.88417 7.73484C7.03861 7.88128 7.03861 8.11872 6.88417 8.26516L4 11"
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
        d="M14 16L17.4697 12.5303C17.7626 12.2374 17.7626 11.7626 17.4697 11.4697L14 8M7 16L10.4697 12.5303C10.7626 12.2374 10.7626 11.7626 10.4697 11.4697L7 8"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Icon>
  );
}
