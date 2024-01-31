import { Icon, IconProps } from './icon/icon';

export function EditIcon(props: IconProps) {
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
