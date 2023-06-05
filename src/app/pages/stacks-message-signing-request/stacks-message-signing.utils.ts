import { useCallback, useState } from 'react';

import { ClarityValue, TupleCV, createStacksPrivateKey } from '@stacks/transactions';

import { finalizeMessageSignature } from '@shared/actions/finalize-message-signature';
import { signMessage, signStructuredDataMessage } from '@shared/crypto/sign-message';
import { logger } from '@shared/logger';
import { UnsignedMessage, whenSignableMessageOfType } from '@shared/signature/signature-types';
import { isString } from '@shared/utils';

import { useAnalytics } from '@app/common/hooks/analytics/use-analytics';
import { useWalletType } from '@app/common/use-wallet-type';
import { createDelay } from '@app/common/utils';
import { useLedgerNavigate } from '@app/features/ledger/hooks/use-ledger-navigate';
import { useCurrentStacksAccount } from '@app/store/accounts/blockchain/stacks/stacks-account.hooks';
import { useSignatureRequestSearchParams } from '@app/store/signatures/requests.hooks';

const improveUxWithShortDelayAsSigningIsSoFast = createDelay(1000);

function useMessageSignerStacksSoftwareWallet() {
  const account = useCurrentStacksAccount();
  return useCallback(
    ({ message, domain }: { message: string | ClarityValue; domain?: TupleCV }) => {
      if (!account || account.type === 'ledger') return null;
      const privateKey = createStacksPrivateKey(account.stxPrivateKey);
      if (isString(message)) {
        return signMessage(message, privateKey);
      } else {
        if (!domain) throw new Error('Domain is required for structured messages');
        // returns signature in RSV format
        return signStructuredDataMessage(message, domain, privateKey);
      }
    },
    [account]
  );
}

export function useStacksMessageSigner() {
  const analytics = useAnalytics();
  const signSoftwareWalletMessage = useMessageSignerStacksSoftwareWallet();

  const { whenWallet } = useWalletType();
  const ledgerNavigate = useLedgerNavigate();

  const [isLoading, setIsLoading] = useState(false);

  const { requestToken, tabId } = useSignatureRequestSearchParams();
  if (!tabId) throw new Error('Requests can only be made with corresponding tab');
  if (!requestToken) throw new Error('Missing request token');

  const signMessage = whenWallet({
    async software(unsignedMessage: UnsignedMessage) {
      setIsLoading(true);
      void analytics.track('request_signature_sign', { type: 'software' });

      const messageSignature = signSoftwareWalletMessage(unsignedMessage);

      if (!messageSignature) {
        logger.error('Cannot sign message, no account in state');
        void analytics.track('request_signature_cannot_sign_message_no_account');
        return;
      }
      await improveUxWithShortDelayAsSigningIsSoFast();
      setIsLoading(false);
      finalizeMessageSignature({ requestPayload: requestToken, tabId, data: messageSignature });
    },

    async ledger(unsignedMessage: UnsignedMessage) {
      void analytics.track('request_signature_sign', { type: 'ledger' });
      whenSignableMessageOfType(unsignedMessage)({
        utf8(msg) {
          ledgerNavigate.toConnectAndSignUtf8MessageStep(msg);
        },
        structured(domain, msg) {
          ledgerNavigate.toConnectAndSignStructuredMessageStep(domain, msg);
        },
      });
    },
  });

  function cancelMessageSigning() {
    if (!requestToken || !tabId) return;
    void analytics.track('request_signature_cancel');
    finalizeMessageSignature({ requestPayload: requestToken, tabId, data: 'cancel' });
  }

  return { isLoading, signMessage, cancelMessageSigning };
}
