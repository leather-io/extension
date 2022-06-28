import { useCallback, useState } from 'react';
import { ClarityValue, createStacksPrivateKey } from '@stacks/transactions';
import { Button, Stack } from '@stacks/ui';
import { TupleCV } from '@stacks/transactions/dist/esm/clarity';

import { finalizeMessageSignature } from '@app/common/actions/finalize-message-signature';
import { useAnalytics } from '@app/common/hooks/analytics/use-analytics';
import { delay } from '@app/common/utils';
import { useCurrentAccount } from '@app/store/accounts/account.hooks';
import { useSignatureRequestSearchParams } from '@app/store/signatures/requests.hooks';
import { signMessage, signStructuredDataMessage } from '@shared/crypto/sign-message';
import { logger } from '@shared/logger';
import { SignatureMessage } from '@shared/signature/types';
import { isString } from '@shared/utils';

function useSignMessageSoftwareWallet() {
  const account = useCurrentAccount();
  return useCallback(
    ({ message, domain }: { message: string | ClarityValue; domain?: TupleCV }) => {
      if (!account || account.type === 'ledger') return null;
      const privateKey = createStacksPrivateKey(account.stxPrivateKey);
      if (isString(message)) {
        // Return signature in VRS format (to be fixed)
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

export function SignAction(props: SignatureMessage): JSX.Element | null {
  const { message, domain } = props;
  const signSoftwareWalletMessage = useSignMessageSoftwareWallet();
  const { tabId, requestToken } = useSignatureRequestSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const analytics = useAnalytics();

  if (!requestToken || !tabId) return null;
  const tabIdInt = parseInt(tabId);

  const sign = async () => {
    setIsLoading(true);
    void analytics.track('request_signature_sign');
    const messageSignature = signSoftwareWalletMessage({ message, domain });
    if (!messageSignature) {
      logger.error('Cannot sign message, no account in state');
      void analytics.track('request_signature_cannot_sign_message_no_account');
      return;
    }
    // Since the signature is really fast, we add a delay to improve the UX
    await delay(1000);
    setIsLoading(false);
    finalizeMessageSignature(requestToken, tabIdInt, messageSignature);
  };

  const cancel = () => {
    void analytics.track('request_signature_cancel');
    finalizeMessageSignature(requestToken, tabIdInt, 'cancel');
  };

  return (
    <Stack isInline>
      <Button onClick={cancel} flexGrow={1} borderRadius="10px" mode="tertiary">
        Cancel
      </Button>
      <Button type="submit" flexGrow={1} borderRadius="10px" onClick={sign} isLoading={isLoading}>
        Sign
      </Button>
    </Stack>
  );
}
