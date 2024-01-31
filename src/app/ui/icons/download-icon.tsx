import { Icon, IconProps } from './icon/icon';

export function DownloadIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path
        d="M20 15V19C20 19.5523 19.5523 20 19 20H5C4.44772 20 4 19.5523 4 19V15M12 14.5V4M12 14.5L8.5 11M12 14.5L15.5 11"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Icon>
  );
}
