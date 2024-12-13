import { ReactNode } from 'react';

import { Box } from 'leather-styles/jsx';

import { ExternalLinkIcon, IconButton } from '@leather.io/ui';

interface CollectibleHoverProps {
  collectibleTypeIcon?: ReactNode;
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
      _focusWithin={{ opacity: 'inherit' }}
      display="flex"
      height="100%"
      left="0px"
      opacity="0"
      overflow="hidden"
      position="absolute"
      style={{ opacity: isHovered ? 'inherit' : '0' }}
      top="0px"
      width="100%"
    >
      <Box
        bottom="space.03"
        height="30px"
        left="space.03"
        position="absolute"
        width="30px"
        zIndex={999}
      >
        {collectibleTypeIcon}
      </Box>
      {onClickCallToAction && (
        <Box bg="ink.background-primary" position="absolute" right="12px" top="12px" zIndex={999}>
          <IconButton
            _focus={{ outline: 'focus' }}
            _hover={{ bg: 'ink.component-background-hover' }}
            bg="ink.background-primary"
            color="ink.action-primary-default"
            icon={<ExternalLinkIcon />}
            onClick={e => {
              e.stopPropagation();
              onClickCallToAction();
            }}
          />
        </Box>
      )}
    </Box>
  );
}
