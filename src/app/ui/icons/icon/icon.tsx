import { styled } from 'leather-styles/jsx';
import type { HTMLStyledProps } from 'leather-styles/types';

type IconVariant = 'default' | 'small';

export interface IconProps extends HTMLStyledProps<'svg'> {
  variant?: IconVariant;
}
export function Icon({ children, opacity = '1', ...props }: IconProps) {
  return (
    <styled.svg fill="none" height="24" opacity={opacity} viewBox="0 0 24 24" width="24" {...props}>
      {children}
    </styled.svg>
  );
}

export function IconSmall({ children, opacity = '1', ...props }: IconProps) {
  return (
    <styled.svg fill="none" height="16" opacity={opacity} viewBox="0 0 16 16" width="16" {...props}>
      {children}
    </styled.svg>
  );
}
