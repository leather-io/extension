import { Icon, IconProps, IconSmall } from './icon/icon';

export function ArrowLeftIcon({ variant, ...props }: IconProps) {
  if (variant === 'small')
    return (
      <IconSmall {...props}>
        <path
          d="M6.44521 12.2214L2.74995 8.52618C2.4896 8.26583 2.4896 7.84373 2.74995 7.58338L6.44521 3.8881M3.11188 8.05478H13.4452"
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
        d="M9.66782 18.082L4.37493 12.7892C3.9844 12.3986 3.9844 11.7655 4.37492 11.3749L9.66782 6.08203M4.91782 12.082H19.9178"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Icon>
  );
}
