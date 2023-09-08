import { Spacing } from '@stacks/ui';
// #4164 FIXME migrate this spacing type and update
import { Box, Flex, FlexProps } from 'leather-styles/jsx';

import { SpaceBetween } from './space-between';

function alignToFlexProp(alignment: FlagAlignment) {
  return {
    top: 'start',
    middle: 'center',
    bottom: 'end',
  }[alignment];
}

type FlagAlignment = 'top' | 'middle' | 'bottom';

interface FlagProps extends FlexProps {
  spacing?: Spacing;
  align?: 'top' | 'middle' | 'bottom';
  children: React.ReactNode;
  img: React.JSX.Element;
}
/**
 * Implementation of flag object
 * https://csswizardry.com/2013/05/the-flag-object/
 * Allows only two children:
 *   1st. Image content
 *   2nd. Body content
 */
export function Flag({ spacing = 'space.02', align = 'top', img, children, ...props }: FlagProps) {
  return (
    <Flex flexDirection="row" align={alignToFlexProp(align)} {...props}>
      <Box mr={spacing}>{img}</Box>
      <Box flex={1}>{children}</Box>
    </Flex>
  );
}

interface FlagWithSpaceBetweenContentProps {
  contentLeft: React.JSX.Element;
  contentRight: React.JSX.Element;
}
export function FlagWithSpaceBetweenContent({
  contentLeft,
  contentRight,
  img,
  spacing,
}: FlagWithSpaceBetweenContentProps & Omit<FlagProps, 'children'>) {
  return (
    <Flag align="middle" img={img} spacing={spacing}>
      <SpaceBetween>
        {contentLeft}
        {contentRight}
      </SpaceBetween>
    </Flag>
  );
}
