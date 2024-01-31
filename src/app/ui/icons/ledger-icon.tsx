import { Icon, IconProps } from './icon/icon';

export function LedgerIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M15 14H11V8.5" stroke="currentColor" strokeWidth="2" />
      <path d="M20 8V4H14" stroke="currentColor" strokeWidth="2" />
      <path d="M20 15V19H14" stroke="currentColor" strokeWidth="2" />
      <path d="M4 8V4H10" stroke="currentColor" strokeWidth="2" />
      <path d="M4 15V19H10" stroke="currentColor" strokeWidth="2" />
    </Icon>
  );
}
