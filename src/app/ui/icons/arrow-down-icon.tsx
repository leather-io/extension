import { Icon, IconProps, IconSmall } from './icon/icon';

export function ArrowDownIcon({ variant, ...props }: IconProps) {
  if (variant === 'small')
    return (
      <IconSmall {...props}>
        <path
          d="M12 9.60939L8.47142 13.138C8.21107 13.3983 7.78896 13.3983 7.52861 13.138L4 9.60939M8.00001 12.7761L8.00001 2.77606"
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
        d="M18 14.4142L12.7071 19.7071C12.3166 20.0976 11.6834 20.0976 11.2929 19.7071L6 14.4142M12 19.1642L12 4.16421"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Icon>
  );
}
