import { Icon, IconProps, IconSmall } from './icon/icon';

export function CopyIcon({ variant, ...props }: IconProps) {
  if (variant === 'small')
    return (
      <IconSmall {...props}>
        <path
          d="M5.8335 5.83325V2.16659C5.8335 1.98249 5.98273 1.83325 6.16683 1.83325H13.8335C14.0176 1.83325 14.1668 1.98249 14.1668 2.16659V9.83325C14.1668 10.0173 14.0176 10.1666 13.8335 10.1666H10.1668M9.8335 5.83325H2.16683C1.98273 5.83325 1.8335 5.98249 1.8335 6.16659V13.8333C1.8335 14.0173 1.98273 14.1666 2.16683 14.1666H9.8335C10.0176 14.1666 10.1668 14.0173 10.1668 13.8333V6.16659C10.1668 5.98249 10.0176 5.83325 9.8335 5.83325Z"
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
        d="M9 9V3.5C9 3.22386 9.22386 3 9.5 3H20.5C20.7761 3 21 3.22386 21 3.5V14.5C21 14.7761 20.7761 15 20.5 15H15M14.5 9H3.5C3.22386 9 3 9.22386 3 9.5V20.5C3 20.7761 3.22386 21 3.5 21H14.5C14.7761 21 15 20.7761 15 20.5V9.5C15 9.22386 14.7761 9 14.5 9Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Icon>
  );
}
