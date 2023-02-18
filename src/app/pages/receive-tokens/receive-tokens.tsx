import toast from 'react-hot-toast';

import { useClipboard } from '@stacks/ui';

import { useCurrentAccountDisplayName } from '@app/common/hooks/account/use-account-names';
import { useAnalytics } from '@app/common/hooks/analytics/use-analytics';
import { useCurrentAccount } from '@app/store/accounts/blockchain/stacks/stacks-account.hooks';

import { ReceiveTokensLayout } from './components/receive-tokens.layout';

// ts-unused-exports:disable-next-line
export function ReceiveTokens() {
  const currentAccount = useCurrentAccount();
  const analytics = useAnalytics();
  const { onCopy } = useClipboard(currentAccount?.address ?? '');
  const accountName = useCurrentAccountDisplayName();

  const copyToClipboard = () => {
    void analytics.track('copy_address_to_clipboard');
    toast.success('Copied to clipboard!');
    onCopy();
  };

  if (!currentAccount) return null;

  return (
    <ReceiveTokensLayout
      accountName={accountName}
      address={currentAccount.address}
      onCopyAddressToClipboard={copyToClipboard}
      title="Receive"
    />
  );
}
