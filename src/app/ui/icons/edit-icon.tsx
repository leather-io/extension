import { Icon, IconProps, IconSmall } from './icon/icon';

export function EditIcon({ variant, ...props }: IconProps) {
  if (variant === 'small')
    return (
      <IconSmall {...props}>
        <path
          d="M8.8335 4.16673L10.8621 2.13813C11.1224 1.87778 11.5446 1.87778 11.8049 2.13813L13.8621 4.19532C14.1224 4.45567 14.1224 4.87778 13.8621 5.13813L11.8335 7.16673M8.8335 4.16673L2.02876 10.9715C1.90373 11.0965 1.8335 11.2661 1.8335 11.4429V14.1667H4.55735C4.73416 14.1667 4.90373 14.0965 5.02876 13.9715L11.8335 7.16673M8.8335 4.16673L11.8335 7.16673"
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
        d="M13.5 6.00009L15.7929 3.7072C16.1834 3.31668 16.8166 3.31668 17.2071 3.7072L20.2929 6.79299C20.6834 7.18351 20.6834 7.81668 20.2929 8.2072L18 10.5001M13.5 6.00009L3.29289 16.2072C3.10536 16.3947 3 16.6491 3 16.9143V20.0001C3 20.5524 3.44772 21.0001 4 21.0001H7.08579C7.351 21.0001 7.60536 20.8947 7.79289 20.7072L18 10.5001M13.5 6.00009L18 10.5001"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Icon>
  );
}
