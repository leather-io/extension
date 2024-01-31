import { styled } from 'leather-styles/jsx';
import type { HTMLStyledProps } from 'leather-styles/types';

export type IconProps = HTMLStyledProps<'svg'>;

export function Icon({
  children,
  height = 'auto',
  opacity = '1',
  width = 'sm',
  ...props
}: IconProps) {
  return (
    <styled.svg
      fill="none"
      height={height}
      opacity={opacity}
      viewBox="0 0 24 24"
      width={width}
      {...props}
    >
      {children}
    </styled.svg>
  );
}
