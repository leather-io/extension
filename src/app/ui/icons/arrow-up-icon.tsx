import { Icon, IconProps, IconSmall } from './icon/icon';

export function ArrowUpIcon({ variant, ...props }: IconProps) {
  if (variant === 'small')
    return (
      <IconSmall {...props}>
        <path
          d="M3.8335 6.50014L7.52875 2.80488C7.7891 2.54453 8.21121 2.54453 8.47156 2.80488L12.1668 6.50014M8.00015 3.16681V13.5001"
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
        d="M6 9.75009L11.2929 4.4572C11.6834 4.06668 12.3166 4.06668 12.7071 4.4572L18 9.75009M12 5.00009V20.0001"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Icon>
  );
}
