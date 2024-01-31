import { Icon, IconProps } from './icon/icon';

export function ExternalLinkIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path
        d="M9 6H5.6C5.03995 6 4.75992 6 4.54601 6.10899C4.35785 6.20487 4.20487 6.35785 4.10899 6.54601C4 6.75992 4 7.03995 4 7.6V18.4C4 18.9601 4 19.2401 4.10899 19.454C4.20487 19.6422 4.35785 19.7951 4.54601 19.891C4.75992 20 5.03995 20 5.6 20H16.4C16.9601 20 17.2401 20 17.454 19.891C17.6422 19.7951 17.7951 19.6422 17.891 19.454C18 19.2401 18 18.9601 18 18.4V15M14 4H20M20 4V10M20 4L11 13"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Icon>
  );
}
