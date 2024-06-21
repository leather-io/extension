import { ReactNode } from 'react';

import { Box, styled } from 'leather-styles/jsx';

import { ArrowUpIcon } from '@leather.io/ui';

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
        <styled.button
          _focus={{ outline: 'focus' }}
          _hover={{ bg: 'ink.component-background-hover' }}
          alignItems="center"
          bg="ink.background-primary"
          borderRadius="50%"
          display="flex"
          height="30px"
          justifyContent="center"
          onClick={e => {
            e.stopPropagation();
            onClickCallToAction();
          }}
          position="absolute"
          right="12px"
          top="12px"
          type="button"
          width="30px"
          zIndex={999}
        >
          <ArrowUpIcon transform="rotate(45deg)" />
        </styled.button>
      )}
    </Box>
  );
}
