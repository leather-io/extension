import { Icon, IconProps } from './icon/icon';

export function ChevronsRightIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path
        d="M14 16L17.4697 12.5303C17.7626 12.2374 17.7626 11.7626 17.4697 11.4697L14 8M7 16L10.4697 12.5303C10.7626 12.2374 10.7626 11.7626 10.4697 11.4697L7 8"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Icon>
  );
}
