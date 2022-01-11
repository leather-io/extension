import React from 'react';
import { toast } from 'react-hot-toast';
import { Box, ButtonProps, color } from '@stacks/ui';

import { AssetWithMeta } from '@common/asset-types';
import { SendFormSelectors } from '@tests/page-objects/send-form.selectors';

function SendMaxButtonAction(props: ButtonProps) {
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

interface SendMaxProps {
  isLoadingFee: boolean | undefined;
  onClick: () => void;
  selectedAsset: AssetWithMeta | undefined;
}

export function SendMaxButton(props: SendMaxProps): JSX.Element | null {
  const { isLoadingFee, onClick, selectedAsset } = props;
  const isStx = selectedAsset?.type === 'stx';

  return isLoadingFee && isStx ? (
    <SendMaxButtonAction onClick={() => toast.error('Unable to calculate max. Try Again.')} />
  ) : (
    <SendMaxButtonAction onClick={onClick} />
  );
}
