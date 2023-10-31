import { Circle, CircleProps, styled } from 'leather-styles/jsx';

interface DynamicColorCircleProps extends CircleProps {
  sizeParam?: string;
  value: string;
}
export function DynamicColorCircle({
  children,
  sizeParam = '36',
  value,
  ...props
}: DynamicColorCircleProps) {
  return (
    <Circle
      position="relative"
      size={`${sizeParam}px`}
      textStyle="label.01"
      textTransform="capitalize"
      {...props}
    >
      <styled.img
        alt="Dynamic avatar"
        borderRadius="inherit"
        src={`https://avatar.vercel.sh/${value}?size=${sizeParam}`}
      />
      {children}
    </Circle>
  );
}
