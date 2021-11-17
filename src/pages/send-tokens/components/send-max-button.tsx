import React from 'react';
import { Box, ButtonProps, color } from '@stacks/ui';

import { SendFormSelectors } from '@tests/page-objects/send-form.selectors';

export function SendMaxButton(props: ButtonProps) {
  return (
    <Box
      as="button"
      color={color('text-caption')}
      data-testid={SendFormSelectors.BtnSendMaxBalance}
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
      {...props}
    >
      Max
    </Box>
  );
}
