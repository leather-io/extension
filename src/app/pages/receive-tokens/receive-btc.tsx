import toast from 'react-hot-toast';
import { useNavigate } from 'react-router';

import { Stack, Text, useClipboard } from '@stacks/ui';

import { RouteUrls } from '@shared/route-urls';

import { useAnalytics } from '@app/common/hooks/analytics/use-analytics';
import { Link } from '@app/components/link';
import { WarningLabel } from '@app/components/warning-label';
import { useCurrentAccountIndex } from '@app/store/accounts/account';
import { useBtcNativeSegwitAccountIndexAddressIndexZero } from '@app/store/accounts/blockchain/bitcoin/native-segwit-account.hooks';

import { ReceiveTokensLayout } from './components/receive-tokens.layout';

export function ReceiveBtcModal() {
  const accountIndex = useCurrentAccountIndex();
  const btcAddress = useBtcNativeSegwitAccountIndexAddressIndexZero(accountIndex);
  const analytics = useAnalytics();
  const { onCopy } = useClipboard(btcAddress);
  const navigate = useNavigate();

  function copyToClipboard() {
    void analytics.track('copy_btc_address_to_clipboard');
    toast.success('Copied to clipboard!');
    onCopy();
  }

  const ReceiveBtcModalWarning = (
    <WarningLabel mt="base-loose" width="100%">
      <Stack>
        <Text color="#242629" fontSize={1} fontWeight={500}>
          Do not deposit Ordinals here
        </Text>
        <Text>
          Use the{' '}
          <Link
            onClick={() => navigate(RouteUrls.ReceiveCollectible)}
            color="blue"
            display="inline-block"
            textDecoration="underline"
          >
            address created for collectibles.
          </Link>
        </Text>
      </Stack>
    </WarningLabel>
  );

  return (
    <ReceiveTokensLayout
      address={btcAddress}
      onCopyAddressToClipboard={copyToClipboard}
      title="Bitcoin address"
      warning={ReceiveBtcModalWarning}
    />
  );
}
