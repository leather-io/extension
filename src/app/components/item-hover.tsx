// #4164 FIXME migrate transition
import { transition } from '@stacks/ui';
import { Box, BoxProps } from 'leather-styles/jsx';
import { token } from 'leather-styles/tokens';
import { useFocus, useHover } from 'use-events';

function ItemHover({
  isFocused,
  isHovered,
  ...rest
}: {
  isFocused: boolean;
  isHovered: boolean;
} & BoxProps) {
  return (
    <Box
      opacity={isFocused || isHovered ? 1 : 0}
      transition={transition}
      borderRadius="16px"
      position="absolute"
      // #4164 FIXME check this
      width="calc(100% + 24px)"
      height="calc(100% + 24px)"
      // size="calc(100% + 24px)"
      left="-12px"
      top="-12px"
      bg={token('colors.brown.2')}
      zIndex={-1}
      {...rest}
    />
  );
}

type HoverBind = ReturnType<typeof useHover>[1];
type FocusBind = ReturnType<typeof useFocus>[1];

interface DefaultSpreadProps extends HoverBind, FocusBind {
  position: 'relative';
  zIndex: 1;
  cursor: 'pointer' | 'default';
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
      position: 'relative',
      zIndex: 1,
      cursor: isPressable ? 'pointer' : 'default',
    },
    { isHovered, isFocused },
  ];
}
