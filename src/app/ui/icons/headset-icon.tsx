import { Icon, IconProps } from './icon/icon';

export function HeadsetIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path
        d="M4 14V12C4 7.58172 7.58172 4 12 4C16.4183 4 20 7.58172 20 12V14M4 14V19C4 19.5523 4.44772 20 5 20H7C7.55228 20 8 19.5523 8 19V15C8 14.4477 7.55228 14 7 14H4ZM20 14V19C20 19.5523 19.5523 20 19 20H17C16.4477 20 16 19.5523 16 19V15C16 14.4477 16.4477 14 17 14H20Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="square"
        strokeLinejoin="round"
      />
    </Icon>
  );
}
