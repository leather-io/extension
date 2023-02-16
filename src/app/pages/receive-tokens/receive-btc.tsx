import toast from 'react-hot-toast';

import { useClipboard } from '@stacks/ui';

import { useAnalytics } from '@app/common/hooks/analytics/use-analytics';
import { useCurrentAccountIndex } from '@app/store/accounts/account';
import { useBtcAccountIndexAddressIndexZero } from '@app/store/accounts/blockchain/bitcoin/bitcoin-account.hooks';

import { ReceiveTokensLayout } from './components/receive-tokens.layout';

export function ReceiveBtcModal() {
  const accountIndex = useCurrentAccountIndex();
  const btcAddress = useBtcAccountIndexAddressIndexZero(accountIndex);
  const analytics = useAnalytics();
  const { onCopy } = useClipboard(btcAddress);

  function copyToClipboard() {
    void analytics.track('copy_btc_address_to_clipboard');
    toast.success('Copied to clipboard!');
    onCopy();
  }

  return (
    <ReceiveTokensLayout
      address={btcAddress}
      onCopyAddressToClipboard={copyToClipboard}
      title="Bitcoin address"
    />
  );
}
