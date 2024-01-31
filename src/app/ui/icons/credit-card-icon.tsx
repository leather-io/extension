import { Icon, IconProps } from './icon/icon';

export function CreditCardIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path
        d="M3 10V18C3 18.5523 3.44772 19 4 19H20C20.5523 19 21 18.5523 21 18V10M3 10V6C3 5.44772 3.44772 5 4 5H20C20.5523 5 21 5.44649 21 5.99878V10M3 10H21M7 14H10"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Icon>
  );
}
