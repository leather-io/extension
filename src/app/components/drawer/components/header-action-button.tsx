import { SVGAttributes } from 'react';

import { Box, Grid, color, transition } from '@stacks/ui';
import { useHover } from 'use-events';

interface IconBaseProps extends SVGAttributes<SVGElement> {
  children?: React.ReactNode;
  size?: string | number;
  color?: string;
  title?: string;
}
type IconType = (props: IconBaseProps) => JSX.Element;

interface HeaderActionButtonProps {
  icon?: IconType;
  isWaitingOnPerformedAction?: boolean;
  onAction?(): void;
}
export function HeaderActionButton(props: HeaderActionButtonProps) {
  const { icon, isWaitingOnPerformedAction, onAction } = props;
  const [isHovered, bind] = useHover();

  return (
    <Grid
      _hover={{
        color: color('text-title'),
        cursor: isWaitingOnPerformedAction ? 'unset' : 'pointer',
      }}
      borderRadius="100%"
      color={color('text-caption')}
      onClick={isWaitingOnPerformedAction ? undefined : onAction}
      opacity={isWaitingOnPerformedAction ? '0.3' : 'unset'}
      placeItems="center"
      position="relative"
      size="36px"
      transition={transition}
      userSelect="none"
      zIndex={9}
      {...bind}
    >
      <Box as={icon} size="20px" color={color('text-caption')} />
      <Box
        bg={color('invert')}
        borderRadius="100%"
        left={0}
        opacity={isHovered && !isWaitingOnPerformedAction ? 0.12 : 0}
        position="absolute"
        size="100%"
        top={0}
        transition={transition}
      />
    </Grid>
  );
}
