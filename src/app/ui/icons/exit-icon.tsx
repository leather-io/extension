import { Icon, IconProps, IconSmall } from './icon/icon';

export function ExitIcon({ variant, ...props }: IconProps) {
  if (variant === 'small')
    return (
      <IconSmall {...props}>
        <path
          d="M7.49984 13.3332H3.33317C2.96498 13.3332 2.6665 13.0347 2.6665 12.6665L2.6665 3.33317C2.6665 2.96498 2.96498 2.6665 3.33317 2.6665L7.49984 2.6665M13.3332 7.99983L5.83317 7.99983M13.3332 7.99983L10.3332 10.9998M13.3332 7.99983L10.3332 4.99984"
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
        d="M11.25 20H5C4.44772 20 4 19.5523 4 19L4 5C4 4.44772 4.44772 4 5 4L11.25 4M20 12L8.75 12M20 12L15.5 16.5M20 12L15.5 7.5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Icon>
  );
}
