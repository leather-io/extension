import { Icon, IconProps } from './icon/icon';

export function CheckmarkIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path
        d="M3 15L9.29412 20L21 4"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Icon>
  );
}
