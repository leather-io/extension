import { Box, Flex, FlexProps } from 'leather-styles/jsx';
import { SpacingToken } from 'leather-styles/tokens';

function alignToFlexProp(alignment: FlagAlignment) {
  return {
    top: 'start',
    middle: 'center',
    bottom: 'end',
  }[alignment];
}

type FlagAlignment = 'top' | 'middle' | 'bottom';

interface FlagProps extends FlexProps {
  spacing?: SpacingToken;
  align?: 'top' | 'middle' | 'bottom';
  children: React.ReactNode;
  img: React.ReactNode;
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
    <Flex flexDirection="row" align={alignToFlexProp(align)} width="100%" {...props}>
      <Box mr={spacing}>{img}</Box>
      <Box flex={1}>{children}</Box>
    </Flex>
  );
}
