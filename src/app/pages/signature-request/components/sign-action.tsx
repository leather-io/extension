import { useState } from 'react';
import { Button, Stack } from '@stacks/ui';

import { finalizeMessageSignature } from '@shared/actions/finalize-message-signature';
import { useAnalytics } from '@app/common/hooks/analytics/use-analytics';
import { createDelay } from '@app/common/utils';
import { useSignatureRequestSearchParams } from '@app/store/signatures/requests.hooks';
import { logger } from '@shared/logger';
import { SignatureMessage } from '@shared/signature/types';
import { isString } from '@shared/utils';
import { useWalletType } from '@app/common/use-wallet-type';
import { useLedgerNavigate } from '@app/features/ledger/hooks/use-ledger-navigate';

import { useSignMessageSoftwareWallet } from '../sign-message.hooks';

const improveUxWithShortDelayAsSigningIsSoFast = createDelay(1000);

export function SignAction(props: SignatureMessage) {
  const { message, domain } = props;

  const analytics = useAnalytics();
  const ledgerNavigate = useLedgerNavigate();

  const [isLoading, setIsLoading] = useState(false);

  const signSoftwareWalletMessage = useSignMessageSoftwareWallet();
  const { tabId, requestToken } = useSignatureRequestSearchParams();
  const { whenWallet } = useWalletType();

  if (!requestToken || !tabId) return null;

  const sign = whenWallet({
    async software() {
      setIsLoading(true);
      void analytics.track('request_signature_sign');

      const messageSignature = signSoftwareWalletMessage({ message, domain });

      if (!messageSignature) {
        logger.error('Cannot sign message, no account in state');
        void analytics.track('request_signature_cannot_sign_message_no_account');
        return;
      }

      await improveUxWithShortDelayAsSigningIsSoFast();
      setIsLoading(false);
      finalizeMessageSignature({ requestPayload: requestToken, tabId, data: messageSignature });
    },
    async ledger() {
      if (!isString(message)) {
        logger.warn(`Ledger does not support structured data message signing`);
        return;
      }
      void analytics.track('request_signature_sign');
      ledgerNavigate.toConnectAndSignMessageStep(message);
    },
  });

  const cancel = () => {
    void analytics.track('request_signature_cancel');
    finalizeMessageSignature({ requestPayload: requestToken, tabId, data: 'cancel' });
  };

  return (
    <Stack isInline>
      <Button onClick={cancel} flexGrow={1} borderRadius="10px" mode="tertiary">
        Cancel
      </Button>
      <Button type="button" flexGrow={1} borderRadius="10px" onClick={sign} isLoading={isLoading}>
        {whenWallet({ software: 'Sign', ledger: 'Sign on Ledger' })}
      </Button>
    </Stack>
  );
}
