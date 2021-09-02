import React, { FC, Suspense } from 'react';
import { Box, color, ButtonProps } from '@stacks/ui';
import { SendFormSelectors } from '@tests/page-objects/send-form.selectors';
import { useFeeRate } from '@store/transactions/fees.hooks';

const SendMaxButton: FC<ButtonProps> = props => (
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
    {...props}
  >
    Max
  </Box>
);

interface SendMaxProps extends ButtonProps {
  onSetMax(fee: number): void;
}
function SendMax({ onSetMax, ...props }: SendMaxProps) {
  const [feeRate] = useFeeRate();
  return (
    <SendMaxButton
      onClick={() => onSetMax(feeRate)}
      data-testid={SendFormSelectors.BtnSendMaxBalance}
      {...props}
    />
  );
}

interface SendMaxWithSuspense extends SendMaxProps {
  showButton: boolean;
}
export function SendMaxWithSuspense({ showButton, onSetMax, ...props }: SendMaxWithSuspense) {
  return (
    <Suspense fallback={<SendMaxButton />}>
      {showButton ? <SendMax onSetMax={onSetMax} {...props} /> : null}
    </Suspense>
  );
}
