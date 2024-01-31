import { Icon, IconProps } from './icon/icon';

export function SwapIcon(props: IconProps) {
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
