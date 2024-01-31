import { Icon, IconProps } from './icon/icon';

export function ArrowUpIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path
        d="M6 9.75009L11.2929 4.4572C11.6834 4.06668 12.3166 4.06668 12.7071 4.4572L18 9.75009M12 5.00009V20.0001"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Icon>
  );
}
