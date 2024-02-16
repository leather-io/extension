import { Icon, IconProps, IconSmall } from './icon/icon';

export function ErrorIcon({ variant, ...props }: IconProps) {
  if (variant === 'small')
    return (
      <IconSmall {...props}>
        <path
          d="M8.00004 6.50001V8.83335M7.42478 2.14882L1.75453 11.8297C1.49422 12.2742 1.81473 12.8333 2.32978 12.8333H13.6703C14.1853 12.8333 14.5059 12.2742 14.2455 11.8297L8.57529 2.14882C8.31779 1.70918 7.68229 1.70918 7.42478 2.14882Z"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <ellipse cx="8.00016" cy="10.4999" rx="0.666667" ry="0.666667" fill="currentColor" />
      </IconSmall>
    );

  return (
    <Icon {...props}>
      <path
        d="M11.9971 10.0156V12.0121M11.1354 3.49213L2.88661 17.4956C2.4946 18.1611 2.9751 19 3.74825 19H20.2459C21.019 19 21.4995 18.1611 21.1075 17.4956L12.8587 3.49213C12.4722 2.83596 11.5219 2.83596 11.1354 3.49213Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <rect x="10.75" y="13.75" width="2.5" height="2.5" rx="1.25" fill="currentColor" />
    </Icon>
  );
}
