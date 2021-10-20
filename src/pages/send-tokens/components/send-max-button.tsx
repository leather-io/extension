import React from 'react';
import { Box, color } from '@stacks/ui';

import { LoadingRectangle } from '@components/loading-rectangle';

interface SendMaxProps {
  isLoadingFee: boolean | undefined;
  onClick: () => void;
}

export function SendMaxButton(props: SendMaxProps): JSX.Element | null {
  const { isLoadingFee, onClick } = props;

  return !isLoadingFee ? (
    <Box
      as="button"
      color={color('text-caption')}
      textStyle="caption"
      position="absolute"
      right="base"
      top="11px"
      border="1px solid"
      borderColor={color('border')}
      py="extra-tight"
      px="tight"
      borderRadius="8px"
      _hover={{ color: color('text-title') }}
      onClick={onClick}
    >
      Max
    </Box>
  ) : (
    <LoadingRectangle height="10px" position="absolute" right="base" top="19px" width="40px" />
  );
}
