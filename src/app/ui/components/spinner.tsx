import { Square, SquareProps, VisuallyHidden } from 'leather-styles/jsx';

interface SpinnerProps extends SquareProps {
  emptyColor?: string;
  label?: string;
  speed?: string;
  thickness?: string;
}

export function Spinner({
  emptyColor = 'transparent',
  size = 'sm',
  label = 'Loading...',
  thickness = '2px',
  speed = '0.85s',
  color = 'ink.text-subdued',
  ...props
}: SpinnerProps) {
  return (
    <Square
      animation="spin"
      borderBottomColor={emptyColor}
      borderColor="currentColor"
      borderLeftColor={emptyColor}
      borderRadius="lg"
      borderWidth={thickness}
      color={color}
      display="inline-block"
      size={size}
      {...props}
    >
      {label && <VisuallyHidden>{label}</VisuallyHidden>}
    </Square>
  );
}
