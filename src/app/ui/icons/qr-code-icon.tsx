import { Icon, IconProps, IconSmall } from './icon/icon';

export function QrCodeIcon({ variant, ...props }: IconProps) {
  if (variant === 'small')
    return (
      <IconSmall {...props}>
        <rect x="2.75" y="2.75" width="3.5" height="3.5" stroke="currentColor" strokeWidth="1.5" />
        <rect x="2.75" y="9.75" width="3.5" height="3.5" stroke="currentColor" strokeWidth="1.5" />
        <rect x="9.75" y="2.75" width="3.5" height="3.5" stroke="currentColor" strokeWidth="1.5" />
        <path d="M9.5 9.5V11.2875H11.5" stroke="currentColor" strokeWidth="1.5" />
        <path
          d="M12.7998 14.0264V11.7096L14.0315 11.7098"
          stroke="currentColor"
          strokeWidth="1.5"
        />
        <rect x="9" y="12.8506" width="1.24319" height="1.2" fill="currentColor" />
        <line x1="13.4019" y1="9.75" x2="11.5" y2="9.75" stroke="currentColor" strokeWidth="1.5" />
      </IconSmall>
    );

  return (
    <Icon {...props}>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M3 5C3 3.89543 3.89543 3 5 3H9C10.1046 3 11 3.89543 11 5V9C11 10.1046 10.1046 11 9 11H5C3.89543 11 3 10.1046 3 9V5ZM9 5H5V9H9V5Z"
        fill="currentColor"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M3 15C3 13.8954 3.89543 13 5 13H9C10.1046 13 11 13.8954 11 15V19C11 20.1046 10.1046 21 9 21H5C3.89543 21 3 20.1046 3 19V15ZM9 15H5V19H9V15Z"
        fill="currentColor"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M13 5C13 3.89543 13.8954 3 15 3H19C20.1046 3 21 3.89543 21 5V9C21 10.1046 20.1046 11 19 11H15C13.8954 11 13 10.1046 13 9V5ZM19 5H15V9H19V5Z"
        fill="currentColor"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M14 13C14.5523 13 15 13.4477 15 14V15H16C16.5523 15 17 15.4477 17 16C17 16.5523 16.5523 17 16 17H14C13.4477 17 13 16.5523 13 16V14C13 13.4477 13.4477 13 14 13ZM17 14C17 13.4477 17.4477 13 18 13H20C20.5523 13 21 13.4477 21 14C21 14.5523 20.5523 15 20 15H18C17.4477 15 17 14.5523 17 14ZM17 18C17 17.4477 17.4477 17 18 17H20C20.5523 17 21 17.4477 21 18C21 18.5523 20.5523 19 20 19H19V20C19 20.5523 18.5523 21 18 21C17.4477 21 17 20.5523 17 20V18Z"
        fill="currentColor"
      />
      <path
        d="M15 20C15 20.5523 14.5523 21 14 21C13.4477 21 13 20.5523 13 20C13 19.4477 13.4477 19 14 19C14.5523 19 15 19.4477 15 20Z"
        fill="currentColor"
      />
    </Icon>
  );
}
