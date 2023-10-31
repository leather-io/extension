import { Circle, CircleProps } from 'leather-styles/jsx';

interface TransactionTypeIconWrapperProps extends CircleProps {
  bg?: any;
  icon: React.JSX.Element;
}
export function TransactionTypeIconWrapper({
  bg,
  icon,
  ...props
}: TransactionTypeIconWrapperProps) {
  return (
    <Circle
      bg="stacks"
      border="background"
      bottom="-2px"
      color="accent.background-primary"
      position="absolute"
      right="-9px"
      size="21px"
      {...props}
    >
      {icon}
    </Circle>
  );
}
