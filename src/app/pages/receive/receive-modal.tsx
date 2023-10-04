import toast from 'react-hot-toast';
import { useLocation, useNavigate } from 'react-router-dom';

import { useClipboard } from '@stacks/ui';
import { HomePageSelectors } from '@tests/selectors/home.selectors';
import { Box, styled } from 'leather-styles/jsx';
import get from 'lodash.get';

import { RouteUrls } from '@shared/route-urls';

import { useAnalytics } from '@app/common/hooks/analytics/use-analytics';
import { StxAvatar } from '@app/components/crypto-assets/stacks/components/stx-avatar';
import { BaseDrawer } from '@app/components/drawer/base-drawer';
import { BtcIcon } from '@app/components/icons/btc-icon';
import { BtcStampsIcon } from '@app/components/icons/btc-stamps-icon';
import { OrdinalIcon } from '@app/components/icons/ordinal-icon';
import { useZeroIndexTaprootAddress } from '@app/store/accounts/blockchain/bitcoin/bitcoin.hooks';
import { useCurrentAccountNativeSegwitAddressIndexZero } from '@app/store/accounts/blockchain/bitcoin/native-segwit-account.hooks';
import { useCurrentAccountStxAddressState } from '@app/store/accounts/blockchain/stacks/stacks-account.hooks';

import { ReceiveItem } from './components/receive-item';
import { ReceiveItemList } from './components/receive-items';

type ReceiveModal = 'full' | 'collectible';

interface ReceiveModalProps {
  type?: 'full' | 'collectible';
}

export function ReceiveModal({ type = 'full' }: ReceiveModalProps) {
  const analytics = useAnalytics();
  const location = useLocation();
  const navigate = useNavigate();
  const btcAddressNativeSegwit = useCurrentAccountNativeSegwitAddressIndexZero();
  const stxAddress = useCurrentAccountStxAddressState();
  const accountIndex = get(location.state, 'accountIndex', undefined);
  const btcAddressTaproot = useZeroIndexTaprootAddress(accountIndex);

  const { onCopy: onCopyBtc } = useClipboard(btcAddressNativeSegwit);
  const { onCopy: onCopyStx } = useClipboard(stxAddress);
  const { onCopy: onCopyOrdinal } = useClipboard(btcAddressTaproot);

  function copyToClipboard(copyHandler: () => void, tracker = 'copy_address_to_clipboard') {
    void analytics.track(tracker);
    toast.success('Copied to clipboard!');
    copyHandler();
  }

  const title =
    type === 'full' ? (
      <>
        Choose asset
        <br />
        to receive
      </>
    ) : (
      <>
        Receive
        <br />
        collectible
      </>
    );

  return (
    <BaseDrawer title="" isShowing onClose={() => navigate('../')}>
      <Box mx="space.06">
        <styled.h1 mb="space.05" textStyle="heading.03">
          {title}
        </styled.h1>
        {type === 'full' && (
          <ReceiveItemList title="Tokens">
            <ReceiveItem
              address={btcAddressNativeSegwit}
              icon={<BtcIcon />}
              dataTestId={HomePageSelectors.ReceiveBtcNativeSegwitQrCodeBtn}
              onCopyAddress={() => copyToClipboard(onCopyBtc)}
              onClickQrCode={() => navigate(RouteUrls.ReceiveBtc)}
              title="Bitcoin"
            />
            <ReceiveItem
              address={stxAddress}
              icon={<StxAvatar />}
              dataTestId={HomePageSelectors.ReceiveStxQrCodeBtn}
              onCopyAddress={() => copyToClipboard(onCopyStx)}
              onClickQrCode={() => navigate(RouteUrls.ReceiveStx)}
              title="Stacks"
            />
          </ReceiveItemList>
        )}
        <ReceiveItemList title={type === 'full' ? 'Collectibles' : undefined}>
          <ReceiveItem
            address={btcAddressTaproot}
            icon={<OrdinalIcon />}
            dataTestId={HomePageSelectors.ReceiveBtcTaprootQrCodeBtn}
            onCopyAddress={() =>
              copyToClipboard(onCopyOrdinal, 'select_stamp_to_add_new_collectible')
            }
            onClickQrCode={() => {
              void analytics.track('select_inscription_to_add_new_collectible');
              navigate(RouteUrls.ReceiveCollectibleOrdinal, { state: { btcAddressTaproot } });
            }}
            title="Ordinal inscription"
          />
          <ReceiveItem
            address={btcAddressNativeSegwit}
            icon={<BtcStampsIcon />}
            onClickQrCode={() => navigate(RouteUrls.ReceiveBtcStamp)}
            onCopyAddress={() => copyToClipboard(onCopyBtc, 'select_stamp_to_add_new_collectible')}
            title="Bitcoin Stamp"
          />
          <ReceiveItem
            address={stxAddress}
            icon={<StxAvatar />}
            onCopyAddress={() => copyToClipboard(onCopyStx, 'select_nft_to_add_new_collectible')}
            onClickQrCode={() => navigate(RouteUrls.ReceiveStx)}
            title="Stacks NFT"
          />
        </ReceiveItemList>
      </Box>
    </BaseDrawer>
  );
}
