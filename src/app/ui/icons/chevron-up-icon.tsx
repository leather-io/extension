import { Icon, IconProps } from './icon/icon';

export function ChevronUpIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path
        d="M4 15.0001L11.2929 7.7072C11.6834 7.31668 12.3166 7.31667 12.7071 7.7072L20 15.0001"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Icon>
  );
}
