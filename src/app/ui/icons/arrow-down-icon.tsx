import { Icon, IconProps } from './icon/icon';

export function ArrowDownIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path
        d="M18 14.4142L12.7071 19.7071C12.3166 20.0976 11.6834 20.0976 11.2929 19.7071L6 14.4142M12 19.1642L12 4.16421"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Icon>
  );
}
