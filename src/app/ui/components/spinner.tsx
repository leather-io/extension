import { Square, SquareProps, VisuallyHidden } from 'leather-styles/jsx';

interface SpinnerProps extends SquareProps {
  emptyColor?: string;
  label?: string;
  speed?: string;
  thickness?: string;
}

export function Spinner({
  emptyColor = 'transparent',
  size = '1.5rem',
  label = 'Loading...',
  thickness = '2px',
  speed = '0.85s',
  color = 'accent.text-subdued',
  ...props
}: SpinnerProps) {
  return (
    <Square
      display="inline-block"
      borderWidth={thickness}
      borderColor="currentColor"
      borderBottomColor={emptyColor}
      borderLeftColor={emptyColor}
      borderRadius="100%"
      color={color}
      size={size}
      animation={`spin ${speed} linear infinite`}
      {...props}
    >
      {label && <VisuallyHidden>{label}</VisuallyHidden>}
    </Square>
  );
}
