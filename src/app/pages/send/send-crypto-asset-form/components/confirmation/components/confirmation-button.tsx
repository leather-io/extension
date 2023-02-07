import { ButtonProps } from '@stacks/ui';
import { SendCryptoAssetSelectors } from '@tests/selectors/send.selectors';

import { PrimaryButton } from '@app/components/primary-button';

export function ConfirmationButton(props: ButtonProps) {
  return (
    <PrimaryButton data-testid={SendCryptoAssetSelectors.ConfirmSendTxBtn} width="100%" {...props}>
      Send
    </PrimaryButton>
  );
}
