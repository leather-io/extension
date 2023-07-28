import { useCallback } from 'react';
import toast from 'react-hot-toast';

import { useClipboard } from '@stacks/ui';

import { useCurrentAccountDisplayName } from '@app/common/hooks/account/use-account-names';
import { useAnalytics } from '@app/common/hooks/analytics/use-analytics';
import { useBackgroundLocationRedirect } from '@app/common/hooks/use-background-location-redirect';
import { useCurrentStacksAccount } from '@app/store/accounts/blockchain/stacks/stacks-account.hooks';

import { ReceiveTokensLayout } from './components/receive-tokens.layout';

export function ReceiveStxModal() {
  useBackgroundLocationRedirect();
  const currentAccount = useCurrentStacksAccount();
  const analytics = useAnalytics();
  const { onCopy } = useClipboard(currentAccount?.address ?? '');
  const accountName = useCurrentAccountDisplayName();

  const copyToClipboard = useCallback(() => {
    void analytics.track('copy_stx_address_to_clipboard');
    toast.success('Copied to clipboard!');
    onCopy();
  }, [analytics, onCopy]);

  if (!currentAccount) return null;

  return (
    <ReceiveTokensLayout
      address={currentAccount.address}
      accountName={accountName}
      onCopyAddressToClipboard={copyToClipboard}
      title="Stacks address"
      hasSubtitle
    />
  );
}
