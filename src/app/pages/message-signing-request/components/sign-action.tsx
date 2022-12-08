import { useState } from 'react';

import { Button, Stack } from '@stacks/ui';

import { finalizeMessageSignature } from '@shared/actions/finalize-message-signature';
import { logger } from '@shared/logger';
import { SignedMessage, whenSignedMessageOfType } from '@shared/signature/signature-types';

import { useAnalytics } from '@app/common/hooks/analytics/use-analytics';
import { useWalletType } from '@app/common/use-wallet-type';
import { createDelay } from '@app/common/utils';
import { useLedgerNavigate } from '@app/features/ledger/hooks/use-ledger-navigate';
import { useSignatureRequestSearchParams } from '@app/store/signatures/requests.hooks';

import { useMessageSignerSoftwareWallet } from '../message-signing.utils';

const improveUxWithShortDelayAsSigningIsSoFast = createDelay(1000);

export function SignAction(message: SignedMessage) {
  const analytics = useAnalytics();
  const ledgerNavigate = useLedgerNavigate();

  const [isLoading, setIsLoading] = useState(false);

  const signSoftwareWalletMessage = useMessageSignerSoftwareWallet();
  const { tabId, requestToken } = useSignatureRequestSearchParams();
  const { whenWallet } = useWalletType();

  if (!requestToken || !tabId) return null;

  const sign = whenWallet({
    async software() {
      setIsLoading(true);
      void analytics.track('request_signature_sign', { type: 'software' });

      const messageSignature = signSoftwareWalletMessage({ ...message });

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
      void analytics.track('request_signature_sign', { type: 'ledger' });
      whenSignedMessageOfType(message)({
        utf8(msg) {
          ledgerNavigate.toConnectAndSignUtf8MessageStep(msg);
        },
        structured(domain, msg) {
          ledgerNavigate.toConnectAndSignStructuredMessageStep(domain, msg);
        },
      });
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
