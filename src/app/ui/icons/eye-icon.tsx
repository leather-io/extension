import { Icon, IconProps } from './icon/icon';

export function EyeIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path
        d="M14.9998 12C14.9998 13.6569 13.6566 15 11.9998 15C10.3429 15 8.99976 13.6569 8.99976 12C8.99976 10.3431 10.3429 9 11.9998 9C13.6566 9 14.9998 10.3431 14.9998 12Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M21.7535 11.5404C16.9121 2.81979 7.0874 2.81989 2.24602 11.5405C2.08856 11.8242 2.08856 12.1759 2.24602 12.4596C7.0874 21.1802 16.9121 21.1801 21.7535 12.4595C21.911 12.1758 21.911 11.8241 21.7535 11.5404Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Icon>
  );
}
