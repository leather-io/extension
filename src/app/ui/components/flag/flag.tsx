import { css } from 'leather-styles/css';
import { Box, Flex, FlexProps } from 'leather-styles/jsx';
import { SpacingToken } from 'leather-styles/tokens';

const flagStyles = css({
  '&[data-align="top"]': {
    alignItems: 'start',
  },
  '&[data-align="middle"]': {
    alignItems: 'center',
  },
  '&[data-align="bottom"]': {
    alignItems: 'end',
  },
});

type FlagAlignment = 'top' | 'middle' | 'bottom';

export interface FlagProps extends FlexProps {
  spacing?: SpacingToken;
  align?: FlagAlignment;
  children: React.ReactNode;
  img?: React.ReactNode;
  reverse?: boolean;
}

/**
 * Implementation of flag object
 * https://csswizardry.com/2013/05/the-flag-object/
 * Allows only two children:
 *   1st. Image content
 *   2nd. Body content
 */
export function Flag({
  spacing = 'space.03',
  align = 'middle',
  reverse = false,
  img,
  children,
  ...props
}: FlagProps) {
  return (
    <Flex
      flexDirection={reverse ? 'row-reverse' : 'row'}
      width="100%"
      data-align={align}
      className={flagStyles}
      {...props}
    >
      <Box ml={reverse ? spacing : ''} mr={!reverse ? spacing : ''}>
        {img}
      </Box>
      <Box flex={1}>{children}</Box>
    </Flex>
  );
}
