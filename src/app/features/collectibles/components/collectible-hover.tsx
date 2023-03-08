import { Box, Flex, color } from '@stacks/ui';

import { figmaTheme } from '@app/common/utils/figma-theme';
import { ArrowIcon } from '@app/components/icons/arrow-icon';

interface CollectibleHoverProps {
  collectibleTypeIcon?: JSX.Element;
  isHovered: boolean;
  onClickCallToAction?(): void;
}
export function CollectibleHover({
  collectibleTypeIcon,
  isHovered,
  onClickCallToAction,
}: CollectibleHoverProps) {
  return (
    <Box
      sx={{ opacity: isHovered ? 'inherit' : '0' }}
      _focusWithin={{ opacity: 'inherit' }}
      display="flex"
      height="100%"
      left="0px"
      opacity="0"
      overflow="hidden"
      position="absolute"
      top="0px"
      width="100%"
      zIndex={999}
    >
      <Box position="absolute" left="12px" bottom="12px">
        {collectibleTypeIcon}
      </Box>
      {onClickCallToAction && (
        <Flex
          onClick={e => {
            e.stopPropagation();
            onClickCallToAction();
          }}
          as="button"
          position="absolute"
          right="12px"
          top="12px"
          width="30px"
          height="30px"
          backgroundColor={color('bg')}
          borderRadius="50%"
          justifyContent="center"
          alignItems="center"
          _hover={{ backgroundColor: figmaTheme.surfaceHovered }}
          _focus={{ outline: `4px solid ${figmaTheme.borderFocused}` }}
        >
          <ArrowIcon />
        </Flex>
      )}
    </Box>
  );
}
