import React from 'react';
import { Box, ButtonProps, color } from '@stacks/ui';
import { toast } from 'react-hot-toast';
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
}

export function SendMaxButton(props: SendMaxProps): JSX.Element | null {
  const { isLoadingFee, onClick } = props;

  return !isLoadingFee ? (
    <SendMaxButtonAction onClick={onClick} />
  ) : (
    <SendMaxButtonAction onClick={() => toast.error('Unable to calculate max spend')} />
  );
}
