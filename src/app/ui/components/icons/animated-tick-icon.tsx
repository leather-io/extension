import { styled } from 'leather-styles/jsx';

import { SvgProps } from '@app/ui/ui-types';

const defaultSize = '20px';

export function AnimatedTickIcon({ size = defaultSize, ...props }: SvgProps) {
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
