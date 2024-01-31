import { Icon, IconProps } from './icon/icon';

export function PlaceholderIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path
        d="M4 6V5C4 4.44772 4.44772 4 5 4H6M18 4H19C19.5523 4 20 4.44772 20 5V6M20 18V19C20 19.5523 19.5523 20 19 20H18M6 20H5C4.44772 20 4 19.5523 4 19V18M4 13.5V10.5M10.5 4H13.5M20 10.5V13.5M13.5 20H10.5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Icon>
  );
}
