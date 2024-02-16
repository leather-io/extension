import { Icon, IconProps, IconSmall } from './icon/icon';

export function CodeIcon({ variant, ...props }: IconProps) {
  if (variant === 'small')
    return (
      <IconSmall {...props}>
        <path
          d="M6.49984 13.5L9.49984 2.5M12.1665 5.16667L14.1881 7.31465C14.5505 7.6997 14.5505 8.30033 14.1881 8.68538L12.1665 10.8333M3.83317 10.8333L1.81155 8.68538C1.44915 8.30033 1.44915 7.6997 1.81155 7.31465L3.83317 5.16667"
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
        d="M10 20L14 4M18 8.00004L21.2929 11.2929C21.6834 11.6835 21.6834 12.3166 21.2929 12.7071L18 16M6 16L2.70711 12.7071C2.31658 12.3166 2.31658 11.6835 2.70711 11.2929L6 8.00004"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Icon>
  );
}
