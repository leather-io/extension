import { useState } from 'react';

import { SignatureData } from '@stacks/connect-jwt';

import { logger } from '@shared/logger';
import { UnsignedMessage } from '@shared/signature/signature-types';
import { analytics } from '@shared/utils/analytics';

import { useWalletType } from '@app/common/use-wallet-type';
import { useLedgerNavigate } from '@app/features/ledger/hooks/use-ledger-navigate';
import {
  improveUxWithShortDelayAsStacksSigningIsSoFast,
  useMessageSignerStacksSoftwareWallet,
} from '@app/features/stacks-message-signer/stacks-message-signing.utils';

import { listenForStacksMessageSigning } from '../ledger/flows/stacks-message-signing/stacks-message-signing-event-listeners';

interface SignStacksMessageProps {
  onSignMessageCompleted(messageSignature: SignatureData): void;
  onSignMessageCancelled(): void;
}
export function useSignStacksMessage({
  onSignMessageCompleted,
  onSignMessageCancelled,
}: SignStacksMessageProps) {
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
      ledgerNavigate.toConnectAndSignMessageStep(unsignedMessage);
      try {
        const messageSignature = await listenForStacksMessageSigning(unsignedMessage);
        onSignMessageCompleted(messageSignature);
      } catch (e) {
        onSignMessageCancelled();
      }
    },
  });

  return { isLoading, signMessage };
}
