import { Icon, IconProps } from './icon/icon';

export function UnlockIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path
        d="M12 14V17M8 10V7C8 4.79086 9.79086 3 12 3C13.8638 3 15.4299 4.27477 15.874 6M6 21H18C18.5523 21 19 20.5523 19 20V11C19 10.4477 18.5523 10 18 10H6C5.44772 10 5 10.4477 5 11V20C5 20.5523 5.44772 21 6 21Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Icon>
  );
}
