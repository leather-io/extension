import { Icon, IconProps, IconSmall } from './icon/icon';

export function ChevronUpIcon({ variant, ...props }: IconProps) {
  if (variant === 'small')
    return (
      <IconSmall {...props}>
        <path
          d="M12.0001 9.86202L8.47148 6.33347C8.21113 6.07312 7.78902 6.07312 7.52867 6.33347L4 9.86206"
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
        d="M4 15.0001L11.2929 7.7072C11.6834 7.31668 12.3166 7.31667 12.7071 7.7072L20 15.0001"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Icon>
  );
}
