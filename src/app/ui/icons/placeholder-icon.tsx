import { Icon, IconProps, IconSmall } from './icon/icon';

export function PlaceholderIcon({ variant, ...props }: IconProps) {
  if (variant === 'small')
    return (
      <IconSmall {...props}>
        <path
          d="M2.5 4.16667V3.16667C2.5 2.79848 2.79848 2.5 3.16667 2.5H4.16667M11.8333 2.5H12.8333C13.2015 2.5 13.5 2.79848 13.5 3.16667V4.16667M13.5 11.8333V12.8333C13.5 13.2015 13.2015 13.5 12.8333 13.5H11.8333M4.16667 13.5H3.16667C2.79848 13.5 2.5 13.2015 2.5 12.8333V11.8333M2.5 9.16667V6.83333M6.83333 2.5H9.16667M13.5 6.83333V9.16667M9.16667 13.5H6.83333"
          stroke="#12100F"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </IconSmall>
    );

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
