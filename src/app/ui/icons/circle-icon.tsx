import { Icon, IconProps } from './icon/icon';

export function CircleIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" />
    </Icon>
  );
}
