import { useCallback } from 'react';
import { toast } from 'react-hot-toast';
import { Box, ButtonProps, color } from '@stacks/ui';

import { AssetWithMeta } from '@app/common/asset-types';
import { SendFormSelectors } from '@tests/page-objects/send-form.selectors';
import { isUndefined } from '@shared/utils';

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
  fee: string | number | undefined;
  onClick: () => void;
  selectedAsset: AssetWithMeta | undefined;
}
export function SendMaxButton(props: SendMaxProps): JSX.Element | null {
  const { fee, onClick, selectedAsset } = props;
  const isStx = selectedAsset?.type === 'stx';

  const fireInactiveSendMaxButtonToast = useCallback(() => {
    if (isUndefined(fee)) toast.error('Loading fee, try again');
    toast.error('A fee must be set to calculate max STX transfer amount');
  }, [fee]);

  return !fee && isStx ? (
    <SendMaxButtonAction onClick={fireInactiveSendMaxButtonToast} />
  ) : (
    <SendMaxButtonAction onClick={onClick} />
  );
}
