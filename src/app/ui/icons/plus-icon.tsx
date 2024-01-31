import { Icon, IconProps } from './icon/icon';

export function PlusIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path
        d="M12 4V12M12 12V20M12 12H4M12 12H20"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </Icon>
  );
}
