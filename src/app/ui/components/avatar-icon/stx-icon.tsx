import { styled } from 'leather-styles/jsx';

import { IconProps } from '../../icons/icon/icon';

// TODO: Will refactor with AvatarIcons, issue #4884
export function StxIcon({ width = 'xl', ...props }: IconProps) {
  return (
    <styled.svg
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height="auto"
      viewBox="0 0 90 90"
      fill="none"
      {...props}
    >
      <circle cx="45" cy="45" r="45" fill="#5546FF" />
      <path
        d="M51.5885 51.0217L58.7579 61.875H53.4021L44.9858 49.1231L36.5696 61.875H31.2421L38.4115 51.0501H28.125V46.9411H61.875V51.0217H51.5885Z"
        fill="white"
      />
      <path
        d="M61.875 38.8366V42.9455V42.9739H28.125V38.8366H38.2132L31.1288 28.125H36.4846L44.9858 41.0469L53.5154 28.125H58.8712L51.7868 38.8366H61.875Z"
        fill="white"
      />
    </styled.svg>
  );
}
