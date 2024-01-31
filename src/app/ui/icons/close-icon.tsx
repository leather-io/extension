import { Icon, IconProps } from './icon/icon';

export function CloseIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M5 5L19 19M19 5L5 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </Icon>
  );
}
