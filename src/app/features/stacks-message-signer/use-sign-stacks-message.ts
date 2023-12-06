import { useState } from 'react';

import { SignatureData } from '@stacks/connect';

import { logger } from '@shared/logger';
import { UnsignedMessage, whenSignableMessageOfType } from '@shared/signature/signature-types';

import { useAnalytics } from '@app/common/hooks/analytics/use-analytics';
import { useWalletType } from '@app/common/use-wallet-type';
import { useLedgerNavigate } from '@app/features/ledger/hooks/use-ledger-navigate';
import {
  improveUxWithShortDelayAsStacksSigningIsSoFast,
  useMessageSignerStacksSoftwareWallet,
} from '@app/features/stacks-message-signer/stacks-message-signing.utils';

interface SignStacksMessageProps {
  onSignMessageCompleted(messageSignature: SignatureData): void;
}

export function useSignStacksMessage({ onSignMessageCompleted }: SignStacksMessageProps) {
  const analytics = useAnalytics();
  const signSoftwareWalletMessage = useMessageSignerStacksSoftwareWallet();

  const { whenWallet } = useWalletType();
  const ledgerNavigate = useLedgerNavigate();

  const [isLoading, setIsLoading] = useState(false);

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
      await improveUxWithShortDelayAsStacksSigningIsSoFast();
      setIsLoading(false);

      onSignMessageCompleted(messageSignature);
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

  return { isLoading, signMessage };
}
