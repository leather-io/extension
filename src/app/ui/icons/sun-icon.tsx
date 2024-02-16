import { Icon, IconProps, IconSmall } from './icon/icon';

export function SunIcon({ variant, ...props }: IconProps) {
  if (variant === 'small')
    return (
      <IconSmall {...props}>
        <g clipPath="url(#clip0_13346_191323)">
          <path
            d="M8.00016 2.00016V1.3335M8.00016 14.6668V14.0002M12.2401 3.7602L12.7134 3.28686M3.28693 12.7135L3.76027 12.2402M14.0002 8.00018H14.6668M1.3335 8.00018H2.00016M12.2401 12.2402L12.7134 12.7135M3.28693 3.28686L3.76027 3.7602M10.3572 5.64314C11.6589 6.94489 11.6589 9.05544 10.3572 10.3572C9.05544 11.6589 6.94489 11.6589 5.64314 10.3572C4.34139 9.05544 4.34139 6.94489 5.64314 5.64314C6.94489 4.34139 9.05544 4.34139 10.3572 5.64314Z"
            stroke="#12100F"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </g>
        <defs>
          <clipPath id="clip0_13346_191323">
            <rect width="16" height="16" fill="white" />
          </clipPath>
        </defs>
      </IconSmall>
    );

  return (
    <Icon {...props}>
      <path
        d="M12 3V2M12 22V21M18.3598 5.64005L19.0698 4.93005M4.93016 19.07L5.64016 18.36M21 12H22M2 12H3M18.3598 18.36L19.0698 19.07M4.93016 4.93005L5.64016 5.64005M15.5355 8.46447C17.4882 10.4171 17.4882 13.5829 15.5355 15.5355C13.5829 17.4882 10.4171 17.4882 8.46447 15.5355C6.51185 13.5829 6.51185 10.4171 8.46447 8.46447C10.4171 6.51185 13.5829 6.51185 15.5355 8.46447Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Icon>
  );
}
