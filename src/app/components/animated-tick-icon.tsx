import { styled } from 'leather-styles/jsx';

const defaultSize = '20px';

interface AnimatedTickProps {
  size?: string;
}
export function AnimatedTick({ size = defaultSize }: AnimatedTickProps) {
  return (
    <styled.svg
      preserveAspectRatio="xMidYMid meet"
      width={size}
      height={size}
      viewBox="0 0 400 400"
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
