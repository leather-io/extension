import { Icon, IconProps, IconSmall } from './icon/icon';

export function ZapIcon({ variant, ...props }: IconProps) {
  if (variant === 'small')
    return (
      <IconSmall {...props}>
        <path
          d="M12.881 5.83333H9.33317C9.05703 5.83333 8.83317 5.60948 8.83317 5.33333V2.1057C8.83317 1.61505 8.20012 1.41792 7.92156 1.82183L2.7071 9.3828C2.47835 9.71449 2.71579 10.1667 3.11871 10.1667H6.6665C6.94265 10.1667 7.1665 10.3905 7.1665 10.6667V13.8943C7.1665 14.385 7.79955 14.5821 8.07811 14.1782L13.2926 6.6172C13.5213 6.28551 13.2839 5.83333 12.881 5.83333Z"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
      </IconSmall>
    );

  return (
    <Icon {...props}>
      <path
        d="M19.5657 9H13.5C13.2239 9 13 8.77614 13 8.5V2.40139C13 1.90668 12.3584 1.71242 12.084 2.12404L4.01823 14.2226C3.79672 14.5549 4.03491 15 4.43426 15H10.5C10.7761 15 11 15.2239 11 15.5V21.5986C11 22.0933 11.6416 22.2876 11.916 21.876L19.9818 9.77735C20.2033 9.44507 19.9651 9 19.5657 9Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
    </Icon>
  );
}
