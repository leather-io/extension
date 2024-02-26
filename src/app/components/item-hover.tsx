import { Square, SquareProps } from 'leather-styles/jsx';
import { useFocus, useHover } from 'use-events';

function ItemHover({
  isFocused,
  isHovered,
  ...rest
}: {
  isFocused: boolean;
  isHovered: boolean;
} & SquareProps) {
  return (
    <Square
      opacity={isFocused || isHovered ? 1 : 0}
      transition="transition"
      borderRadius="xs"
      position="absolute"
      size="calc(100% + 24px)"
      left="-12px"
      top="-12px"
      bg="ink.component-background-hover"
      zIndex={-1}
      {...rest}
    />
  );
}

type HoverBind = ReturnType<typeof useHover>[1];
type FocusBind = ReturnType<typeof useFocus>[1];

interface DefaultSpreadProps extends HoverBind, FocusBind {
  cursor: 'pointer' | 'default';
  position: 'relative';
  zIndex: 1;
}

interface StateReturnProps {
  isHovered: boolean;
  isFocused: boolean;
}

type UsePressableReturn = [React.JSX.Element, DefaultSpreadProps, StateReturnProps];

export function usePressable(isPressable?: boolean): UsePressableReturn {
  const [isHovered, bind] = useHover();
  const [isFocused, focusBind] = useFocus();

  const component = <ItemHover isHovered={isHovered} isFocused={isFocused} />;
  if (!isPressable)
    return [
      <></>,
      // Not really this type but it's safe to spread
      {} as unknown as DefaultSpreadProps,
      { isFocused: false, isHovered: false } as const,
    ];
  return [
    component,
    {
      ...bind,
      ...focusBind,
      cursor: isPressable ? 'pointer' : 'default',
      position: 'relative',
      zIndex: 1,
    },
    { isHovered, isFocused },
  ];
}
