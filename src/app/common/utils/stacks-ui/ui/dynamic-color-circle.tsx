import { ReactNode } from 'react';

import { BoxProps, Circle } from 'leather-styles/jsx';

// import { GridProps } from './grid';
import { useGradients } from './hooks/use-gradient';

interface DynamicColorCircleProps extends BoxProps {
  string: string;
  children?: ReactNode;
  size: string | number;
}
// FIXME refactor this to be typed better
export function DynamicColorCircle({ string, children, ...rest }: DynamicColorCircleProps) {
  const { getGradient } = useGradients();
  const gradient = getGradient(string);

  return (
    <Circle
      textTransform="capitalize"
      flexShrink={0}
      backgroundImage={gradient}
      position="relative"
      fontWeight="500"
      {...rest}
    >
      {children}
    </Circle>
  );
}
