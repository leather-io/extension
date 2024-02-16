import { Icon, IconProps, IconSmall } from './icon/icon';

export function CreditCardIcon({ variant, ...props }: IconProps) {
  if (variant === 'small')
    return (
      <IconSmall {...props}>
        <path
          d="M1.8335 6.50011V12.1642C1.8335 12.5324 2.13197 12.8308 2.50016 12.8308L13.4976 12.8308C13.8657 12.8308 14.1642 12.5324 14.1642 12.1642V6.50011M1.8335 6.50011V3.83537C1.8335 3.46718 2.13197 3.1687 2.50016 3.1687H13.4969C13.8643 3.1687 14.1625 3.466 14.1631 3.83343C14.1646 4.72232 14.1642 5.61122 14.1642 6.50011M1.8335 6.50011H14.1642M4.50016 8.83341H6.50016"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </IconSmall>
    );

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
