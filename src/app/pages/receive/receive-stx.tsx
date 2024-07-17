import { analytics } from '@shared/utils/analytics';

import { useCurrentAccountDisplayName } from '@app/common/hooks/account/use-account-names';
import { copyToClipboard } from '@app/common/utils/copy-to-clipboard';
import { useToast } from '@app/features/toasts/use-toast';
import { useBackgroundLocationRedirect } from '@app/routes/hooks/use-background-location-redirect';
import { useCurrentStacksAccount } from '@app/store/accounts/blockchain/stacks/stacks-account.hooks';

import { ReceiveTokensLayout } from './components/receive-tokens.layout';

export function ReceiveStxModal() {
  useBackgroundLocationRedirect();
  const toast = useToast();
  const currentAccount = useCurrentStacksAccount();

  const { data: accountName = 'Account' } = useCurrentAccountDisplayName();

  if (!currentAccount) return null;

  return (
    <ReceiveTokensLayout
      address={currentAccount.address}
      accountName={accountName}
      onCopyAddressToClipboard={async () => {
        void analytics.track('copy_stx_address_to_clipboard');
        await copyToClipboard(currentAccount.address);
        toast.success('Copied to clipboard!');
      }}
      title="STX"
    />
  );
}
