import { Icon, IconProps, IconSmall } from './icon/icon';

export function SwapIcon({ variant, ...props }: IconProps) {
  if (variant === 'small')
    return (
      <IconSmall {...props}>
        <path
          d="M11.6665 14.1665L13.4308 12.4022C13.5609 12.272 13.5609 12.061 13.4308 11.9308L11.6665 10.1665M4.33312 1.83317L2.56882 3.59747C2.43865 3.72764 2.43865 3.9387 2.56882 4.06887L4.33312 5.83317M3.49979 3.83317H12.8331C13.2013 3.83317 13.4998 4.13165 13.4998 4.49984V7.1665M2.49979 9.1665V11.4998C2.49979 11.868 2.79826 12.1665 3.16645 12.1665H12.4998"
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
        d="M17.2499 21L19.8964 18.3536C20.0916 18.1583 20.0916 17.8417 19.8964 17.6464L17.2499 15M6.74992 3L4.10348 5.64645C3.90822 5.84171 3.90822 6.15829 4.10348 6.35355L6.74992 9M4.99992 6H18.9999C19.5522 6 19.9999 6.44772 19.9999 7V11M3.99992 13V17C3.99992 17.5523 4.44764 18 4.99992 18H18.9999"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Icon>
  );
}
