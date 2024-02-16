import { Icon, IconProps, IconSmall } from './icon/icon';

export function ReloadIcon({ variant, ...props }: IconProps) {
  if (variant === 'small')
    return (
      <IconSmall {...props}>
        <path
          d="M13.1729 9.83333C12.4178 11.9695 10.3806 13.5 7.98584 13.5C4.94827 13.5 2.48584 11.0376 2.48584 8C2.48584 4.96243 4.94827 2.5 7.98584 2.5C9.86394 2.5 11.1192 3.30292 12.3332 4.6726M12.8332 2.66667V5C12.8332 5.18409 12.6839 5.33333 12.4998 5.33333H10.1665"
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
        d="M19.5165 14.6667C18.4182 17.7738 15.4549 20 11.9717 20C7.5534 20 3.97168 16.4183 3.97168 12C3.97168 7.58172 7.5534 4 11.9717 4C14.8553 4 16.7295 5.30135 18.5891 7.5M19 4V7.5C19 7.77614 18.7761 8 18.5 8H15"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Icon>
  );
}
