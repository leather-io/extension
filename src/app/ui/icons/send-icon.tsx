import { Icon, IconProps, IconSmall } from './icon/icon';

export function SendIcon({ variant, ...props }: IconProps) {
  if (variant === 'small')
    return (
      <IconSmall {...props}>
        <path
          d="M4.00023 8.00006H6.16689M4.00023 8.00006L2.25471 2.7635C2.1608 2.48177 2.45439 2.22714 2.72001 2.35995L13.4039 7.70192C13.6496 7.82476 13.6496 8.17536 13.4039 8.2982L2.72001 13.6402C2.45439 13.773 2.1608 13.5183 2.25471 13.2366L4.00023 8.00006Z"
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
        d="M6 11.9998H9M6 11.9998L3.82156 4.59315C3.69867 4.17534 4.13159 3.81106 4.52225 4.00356L19.8398 11.5513C20.2118 11.7346 20.2118 12.2651 19.8398 12.4484L4.52225 19.9961C4.13158 20.1886 3.69867 19.8244 3.82156 19.4065L6 11.9998Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Icon>
  );
}
