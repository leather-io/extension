import { Icon, IconProps } from './icon/icon';

export function ChevronDownIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path
        d="M20 9L12.7071 16.2929C12.3166 16.6834 11.6834 16.6834 11.2929 16.2929L4 9"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Icon>
  );
}
