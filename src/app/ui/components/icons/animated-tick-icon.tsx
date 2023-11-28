import { HTMLStyledProps, styled } from 'leather-styles/jsx';
import { SizeToken } from 'leather-styles/tokens';

import { LiteralUnion } from '@shared/utils/type-utils';

const defaultSize = '20px';

interface AnimatedTickIconProps extends HTMLStyledProps<'svg'> {
  size?: LiteralUnion<SizeToken, string>;
}
export function AnimatedTickIcon({ size = defaultSize, ...props }: AnimatedTickIconProps) {
  return (
    <styled.svg
      preserveAspectRatio="xMidYMid meet"
      width={size}
      height={size}
      viewBox="0 0 400 400"
      {...props}
    >
      <styled.polyline
        fill="none"
        stroke="currentColor"
        strokeWidth="24"
        points="88,214 173,284 304,138"
        strokeDasharray="350"
        strokeDashoffset="350"
        transformOrigin="center"
        transform="translateY(-10px)"
        scale={1.5}
        animation="animatedTick 750ms ease-out"
        animationDelay="200ms"
        animationFillMode="forwards"
      />
    </styled.svg>
  );
}
