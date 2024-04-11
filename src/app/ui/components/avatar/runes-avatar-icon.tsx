import { Avatar, type AvatarProps } from './avatar';

export function RunesAvatarIcon(props: AvatarProps) {
  return (
    <Avatar.Root {...props}>
      <Avatar.Svg>
        <circle cx="16" cy="16" r="16" fill="black" />
        <circle cx="16" cy="16" r="15.5" stroke="#B1977B" strokeOpacity="0.1" />
        <g clipPath="url(#clip0_15326_75304)">
          <rect width="18" height="17.1" transform="translate(7 7.94995)" fill="black" />
          <path d="M8.61722 5.97876L23.3818 26.8953" stroke="white" strokeWidth="2.25" />
          <path d="M23.3823 5.97876L8.61768 26.8953" stroke="white" strokeWidth="2.25" />
          <path d="M15.9998 7.82446L15.9998 25.0499" stroke="white" strokeWidth="1.75" />
          <path
            d="M20.0137 10.7512L22.8552 16.4273L20.0656 22.1859"
            stroke="white"
            strokeWidth="1.75"
          />
          <path
            d="M11.999 10.7512L9.15748 16.4273L11.9471 22.1859"
            stroke="white"
            strokeWidth="1.75"
          />
        </g>
        <defs>
          <clipPath id="clip0_15326_75304">
            <rect width="18" height="17.1" fill="white" transform="translate(7 7.94995)" />
          </clipPath>
        </defs>
      </Avatar.Svg>
    </Avatar.Root>
  );
}
