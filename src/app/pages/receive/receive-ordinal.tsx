import { useLocation } from 'react-router-dom';

import { analytics } from '@shared/utils/analytics';

import { copyToClipboard } from '@app/common/utils/copy-to-clipboard';
import { useToast } from '@app/features/toasts/use-toast';
import { useBackgroundLocationRedirect } from '@app/routes/hooks/use-background-location-redirect';

import { ReceiveBtcModalWarning } from './components/receive-btc-warning';
import { ReceiveTokensLayout } from './components/receive-tokens.layout';

export function ReceiveOrdinalModal() {
  useBackgroundLocationRedirect();
  const toast = useToast();

  const { state } = useLocation();

  // #4028 FIXME - this doesn't open in new tab as it loses btcAddressTaproot amd crashes btcStamp and Stx are OK?
  return (
    <ReceiveTokensLayout
      address={state.btcAddressTaproot}
      onCopyAddressToClipboard={async () => {
        void analytics.track('copy_address_to_add_new_inscription');
        await copyToClipboard(state.btcAddressTaproot);
        toast.success('Copied to clipboard!');
      }}
      title="ORD. INSCRIPTION"
      warning={<ReceiveBtcModalWarning message="Deposit only Ordinal inscriptions here" />}
    />
  );
}
