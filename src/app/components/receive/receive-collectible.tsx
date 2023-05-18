import toast from 'react-hot-toast';
import { useLocation, useNavigate } from 'react-router-dom';

import BitcoinStampImg from '@assets/images/bitcoin-stamp.png';
import { Box, Stack, useClipboard } from '@stacks/ui';
import get from 'lodash.get';

import { RouteUrls } from '@shared/route-urls';

import { useAnalytics } from '@app/common/hooks/analytics/use-analytics';
import { StxAvatar } from '@app/components/crypto-assets/stacks/components/stx-avatar';
import { OrdinalIcon } from '@app/components/icons/ordinal-icon';
import { useZeroIndexTaprootAddress } from '@app/query/bitcoin/ordinals/use-zero-index-taproot-address';
import { useCurrentAccountNativeSegwitAddressIndexZero } from '@app/store/accounts/blockchain/bitcoin/native-segwit-account.hooks';
import { useCurrentAccountStxAddressState } from '@app/store/accounts/blockchain/stacks/stacks-account.hooks';

import { ReceiveCollectibleItem } from './receive-collectible-item';

export function ReceiveCollectible() {
  const analytics = useAnalytics();
  const location = useLocation();
  const navigate = useNavigate();
  const accountIndex = get(location.state, 'accountIndex', undefined);
  const btcAddressNativeSegwit = useCurrentAccountNativeSegwitAddressIndexZero();
  const btcAddressTaproot = useZeroIndexTaprootAddress(accountIndex);

  // TODO: Reuse later for privacy mode
  // const { isLoading, isError, data: btcAddress } = useNextFreshTaprootAddressQuery(accountIndex);

  const stxAddress = useCurrentAccountStxAddressState();
  const { onCopy: onCopyBitcoin } = useClipboard(btcAddressNativeSegwit);
  const { onCopy: onCopyStacks } = useClipboard(stxAddress);

  function copyBitcoinAddressToClipboard(copyHandler: () => void) {
    void analytics.track('select_stamp_to_add_new_collectible');
    toast.success('Copied to clipboard!');
    copyHandler();
  }

  function copyStacksAddressToClipboard(copyHandler: () => void) {
    void analytics.track('select_nft_to_add_new_collectible');
    toast.success('Copied to clipboard!');
    copyHandler();
  }

  if (!btcAddressTaproot) return null;

  return (
    <Stack spacing="loose" mt="base" mb="extra-loose">
      <ReceiveCollectibleItem
        address={btcAddressTaproot}
        icon={<OrdinalIcon />}
        onCopyAddress={() => {
          void analytics.track('select_inscription_to_add_new_collectible');
          navigate(RouteUrls.ReceiveCollectibleOrdinal, { state: { btcAddressTaproot } });
        }}
        title="Ordinal inscription"
      />
      <ReceiveCollectibleItem
        address={btcAddressNativeSegwit}
        icon={
          <Box>
            <img src={BitcoinStampImg} width="36px" />
          </Box>
        }
        onCopyAddress={() => copyBitcoinAddressToClipboard(onCopyBitcoin)}
        title="Bitcoin Stamp"
      />
      <ReceiveCollectibleItem
        address={stxAddress}
        icon={<StxAvatar />}
        onCopyAddress={() => copyStacksAddressToClipboard(onCopyStacks)}
        title="Stacks NFT"
      />
    </Stack>
  );
}
