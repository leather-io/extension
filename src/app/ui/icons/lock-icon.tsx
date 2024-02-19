import { Icon, IconProps } from './icon/icon';

export function LockIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path
        d="M16 10V7C16 4.79086 14.2091 3 12 3C9.79086 3 8 4.79086 8 7V10M12 14V17M6 21H18C18.5523 21 19 20.5523 19 20V11C19 10.4477 18.5523 10 18 10H6C5.44772 10 5 10.4477 5 11V20C5 20.5523 5.44772 21 6 21Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Icon>
  );
}
