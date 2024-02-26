import { Icon, IconProps, IconSmall } from './icon/icon';

export function StacksIcon({ variant, ...props }: IconProps) {
  if (variant === 'small')
    return (
      <IconSmall {...props}>
        <path
          d="M10.3332 9.5L12.9999 13.5H10.9999L7.99988 9.5L4.99988 13.5H2.99988L5.66655 9.5H1.99988V8H13.9999L13.9995 9.5H10.3332ZM13.9992 5.6665L13.9995 6.99984H1.99951V5.6665H5.66618L3.06828 1.6665H4.99951L7.99951 5.6665L10.9995 1.6665H12.9995L10.3328 5.6665H13.9992Z"
          fill="currentColor"
        />
      </IconSmall>
    );

  return (
    <Icon {...props}>
      <path
        d="M15.5 15L19.5 21H16.5L12 15L7.5 21H4.5L8.5 15H3V13.0352H20.9995V15H15.5ZM20.9995 9L21 11H3V9H8.5L4.60315 3H7.5L12 9L16.5 3H19.5L15.5 9H20.9995Z"
        fill="currentColor"
      />
    </Icon>
  );
}
