import { Icon, IconProps, IconSmall } from './icon/icon';

export function WorldIcon({ variant, ...props }: IconProps) {
  if (variant === 'small')
    return (
      <IconSmall {...props}>
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M3.16011 5.75696C2.84354 6.43886 2.66683 7.19888 2.66683 8.00016C2.66683 9.23266 3.0849 10.3675 3.78697 11.2706L5.65167 9.40594C4.66342 8.34489 3.88332 7.25658 3.40418 6.2983C3.31326 6.11646 3.23124 5.93549 3.16011 5.75696ZM5.75746 3.15988C5.93593 3.23099 6.11683 3.31298 6.29861 3.40387C7.25689 3.88301 8.3452 4.66312 9.40625 5.65137L11.2706 3.78697C10.3675 3.0849 9.23266 2.66683 8.00016 2.66683C7.19907 2.66683 6.43923 2.84345 5.75746 3.15988ZM12.2194 2.83824C11.0701 1.89776 9.60104 1.3335 8.00016 1.3335C4.31826 1.3335 1.3335 4.31826 1.3335 8.00016C1.3335 9.60104 1.89776 11.0701 2.83824 12.2194L2.34341 12.7142C2.08306 12.9746 2.08306 13.3967 2.34341 13.657C2.60376 13.9174 3.02587 13.9174 3.28621 13.657L3.78106 13.1622C4.9303 14.1026 6.39934 14.6668 8.00016 14.6668C9.83145 14.6668 11.4903 13.9285 12.6952 12.7332C12.7017 12.7269 12.7081 12.7206 12.7145 12.7142C12.7209 12.7078 12.7273 12.7013 12.7336 12.6948C13.9286 11.4899 14.6668 9.83125 14.6668 8.00016C14.6668 6.39934 14.1026 4.9303 13.1622 3.78106L13.6571 3.28612C13.9175 3.02577 13.9175 2.60366 13.6571 2.34331C13.3968 2.08296 12.9747 2.08296 12.7143 2.34331L12.2194 2.83824ZM12.2134 4.72979L10.3491 6.59417C11.3374 7.65529 12.1176 8.74367 12.5968 9.70201C12.6876 9.88362 12.7695 10.0644 12.8405 10.2427C13.1569 9.56094 13.3335 8.80117 13.3335 8.00016C13.3335 6.76771 12.9155 5.6329 12.2134 4.72979ZM11.7734 11.7694C11.7743 11.7681 11.7757 11.766 11.7775 11.7627C11.7811 11.7559 11.7876 11.7416 11.7936 11.7165C11.8061 11.6639 11.8143 11.5741 11.7981 11.4374C11.7652 11.1591 11.6418 10.7735 11.4042 10.2983C10.9987 9.48727 10.3111 8.5152 9.40562 7.53761L7.53792 9.40532C8.51551 10.3108 9.48757 10.9984 10.2986 11.4039C10.7738 11.6415 11.1594 11.7648 11.4377 11.7978C11.5744 11.814 11.6642 11.8058 11.7168 11.7932C11.7419 11.7872 11.7562 11.7808 11.7631 11.7772C11.7663 11.7754 11.7684 11.774 11.7697 11.7731C11.771 11.7718 11.7722 11.7706 11.7734 11.7694ZM10.2432 12.8403C10.0648 12.7692 9.88399 12.6873 9.70232 12.5964C8.74398 12.1173 7.65559 11.3371 6.59448 10.3488L4.72979 12.2134C5.6329 12.9155 6.76771 13.3335 8.00016 13.3335C8.80137 13.3335 9.56131 13.1568 10.2432 12.8403ZM6.59512 8.4625L8.46281 6.59481C7.48529 5.68939 6.5133 5.00193 5.70232 4.59644C5.22708 4.35882 4.84156 4.23547 4.56325 4.20248C4.42656 4.18628 4.33675 4.19448 4.28415 4.20707C4.25906 4.21307 4.24473 4.2195 4.23788 4.22315C4.23168 4.22646 4.22968 4.22847 4.22926 4.22889C4.22884 4.22931 4.22676 4.23137 4.22346 4.23757C4.21981 4.24442 4.21338 4.25875 4.20738 4.28384C4.19479 4.33644 4.18659 4.42625 4.20279 4.56294C4.23577 4.84125 4.35913 5.22677 4.59675 5.70201C5.00224 6.51299 5.6897 7.48498 6.59512 8.4625Z"
          fill="currentColor"
        />
      </IconSmall>
    );

  return (
    <Icon {...props}>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M4.73992 8.6352C4.26506 9.65805 4 10.7981 4 12C4 13.8488 4.62711 15.551 5.68021 16.9057L8.47727 14.1087C6.99489 12.5171 5.82474 10.8846 5.10603 9.4472C4.96965 9.17444 4.84662 8.90299 4.73992 8.6352ZM8.63595 4.73957C8.90364 4.84625 9.175 4.96923 9.44767 5.10556C10.8851 5.82428 12.5176 6.99443 14.1091 8.4768L16.9057 5.68021C15.551 4.62711 13.8488 4 12 4C10.7984 4 9.6586 4.26493 8.63595 4.73957ZM18.3288 4.25712C16.6049 2.84639 14.4013 2 12 2C6.47715 2 2 6.47715 2 12C2 14.4013 2.84639 16.6049 4.25712 18.3288L3.51486 19.0711C3.12434 19.4616 3.12434 20.0948 3.51486 20.4853C3.90539 20.8758 4.53855 20.8758 4.92908 20.4853L5.67135 19.743C7.39521 21.1537 9.59877 22 12 22C14.7469 22 17.2352 20.8924 19.0425 19.0995C19.0522 19.0902 19.0619 19.0807 19.0715 19.0711C19.0812 19.0614 19.0907 19.0517 19.1001 19.0419C20.8927 17.2346 22 14.7466 22 12C22 9.59877 21.1537 7.39521 19.743 5.67135L20.4854 4.92894C20.876 4.53841 20.876 3.90525 20.4854 3.51473C20.0949 3.1242 19.4617 3.1242 19.0712 3.51473L18.3288 4.25712ZM18.3199 7.09444L15.5234 9.89101C17.0059 11.4827 18.1761 13.1153 18.8949 14.5528C19.0311 14.8252 19.154 15.0963 19.2606 15.3637C19.7351 14.3412 20 13.2015 20 12C20 10.1513 19.3729 8.44911 18.3199 7.09444ZM17.6598 17.6539C17.6613 17.6519 17.6633 17.6488 17.666 17.6439C17.6714 17.6336 17.6811 17.6121 17.6901 17.5745C17.709 17.4956 17.7213 17.3608 17.697 17.1558C17.6475 16.7383 17.4625 16.1601 17.106 15.4472C16.4978 14.2307 15.4665 12.7726 14.1082 11.3062L11.3066 14.1077C12.773 15.466 14.2311 16.4973 15.4477 17.1056C16.1605 17.462 16.7388 17.647 17.1563 17.6965C17.3613 17.7208 17.496 17.7085 17.5749 17.6896C17.6126 17.6806 17.6341 17.671 17.6443 17.6655C17.6492 17.6629 17.6524 17.6608 17.6544 17.6593C17.6562 17.6575 17.658 17.6557 17.6598 17.6539ZM15.3645 19.2602C15.0969 19.1536 14.8257 19.0307 14.5532 18.8944C13.1157 18.1757 11.4831 17.0054 9.89147 15.5229L7.09444 18.3199C8.44911 19.3729 10.1513 20 12 20C13.2018 20 14.3417 19.735 15.3645 19.2602ZM9.89243 12.6935L12.694 9.89197C11.2277 8.53384 9.76971 7.50265 8.55324 6.89442C7.84038 6.53799 7.26209 6.35295 6.84463 6.30348C6.6396 6.27918 6.50488 6.29148 6.42598 6.31036C6.38834 6.31936 6.36685 6.329 6.35657 6.33448C6.34727 6.33944 6.34427 6.34246 6.34364 6.34309C6.34301 6.34372 6.3399 6.34681 6.33495 6.35611C6.32947 6.36639 6.31982 6.38788 6.31082 6.42552C6.29194 6.50442 6.27964 6.63914 6.30394 6.84417C6.35342 7.26163 6.53845 7.83991 6.89488 8.55278C7.50311 9.76924 8.5343 11.2272 9.89243 12.6935Z"
        fill="currentColor"
      />
    </Icon>
  );
}
