import toast from 'react-hot-toast';
import { Outlet, useNavigate } from 'react-router-dom';

import { useClipboard } from '@stacks/ui';
import { HomePageSelectors } from '@tests/selectors/home.selectors';
import { Box, styled } from 'leather-styles/jsx';
import { token } from 'leather-styles/tokens';
import get from 'lodash.get';

import { RouteUrls } from '@shared/route-urls';

import { useAnalytics } from '@app/common/hooks/analytics/use-analytics';
import { useBackgroundLocationRedirect } from '@app/common/hooks/use-background-location-redirect';
import { useLocationState } from '@app/common/hooks/use-location-state';
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
  useBackgroundLocationRedirect();
  const analytics = useAnalytics();
  const backgroundLocation = useLocationState<Location>('backgroundLocation');
  const navigate = useNavigate();
  const btcAddressNativeSegwit = useCurrentAccountNativeSegwitAddressIndexZero();
  const stxAddress = useCurrentAccountStxAddressState();
  const accountIndex = useLocationState<number>('accountIndex');
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
    <>
      <BaseDrawer
        position={['absolute', 'fixed']}
        top={[token('spacing.space.07'), 0]}
        title=""
        isShowing
        onClose={() => navigate(backgroundLocation.pathname ?? '..')}
      >
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
                onClickQrCode={() =>
                  navigate(RouteUrls.ReceiveBtc, {
                    state: { backgroundLocation },
                  })
                }
                title="Bitcoin"
              />
              <ReceiveItem
                address={stxAddress}
                icon={<StxAvatar />}
                dataTestId={HomePageSelectors.ReceiveStxQrCodeBtn}
                onCopyAddress={() => copyToClipboard(onCopyStx)}
                onClickQrCode={() =>
                  navigate(RouteUrls.ReceiveStx, {
                    relative: 'route',
                    state: { backgroundLocation },
                  })
                }
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
                // navigate(RouteUrls.ReceiveCollectibleOrdinal, { state: { btcAddressTaproot } });
                // TODO improve and refactor
                // using absolute path here so it opens from Add new OR inside Receive modal
                // FIXME - BUG - not seeing taproot when open in new tab
                navigate(`/${RouteUrls.Receive}/${RouteUrls.ReceiveCollectibleOrdinal}`, {
                  state: {
                    btcAddressTaproot,
                    backgroundLocation: backgroundLocation,
                  },
                });
              }}
              title="Ordinal inscription"
            />
            <ReceiveItem
              address={btcAddressNativeSegwit}
              icon={<BtcStampsIcon />}
              onClickQrCode={() =>
                navigate(`/${RouteUrls.Receive}/${RouteUrls.ReceiveBtcStamp}`, {
                  state: {
                    backgroundLocation: backgroundLocation,
                  },
                })
              }
              onCopyAddress={() =>
                copyToClipboard(onCopyBtc, 'select_stamp_to_add_new_collectible')
              }
              title="Bitcoin Stamp"
            />
            <ReceiveItem
              address={stxAddress}
              icon={<StxAvatar />}
              onCopyAddress={() => copyToClipboard(onCopyStx, 'select_nft_to_add_new_collectible')}
              onClickQrCode={() =>
                navigate(`/${RouteUrls.Receive}/${RouteUrls.ReceiveStx}`, {
                  state: {
                    backgroundLocation: backgroundLocation,
                  },
                })
              }
              title="Stacks NFT"
            />
          </ReceiveItemList>
        </Box>
      </BaseDrawer>

      {/* Outlet here for nested token routes */}
      <Outlet />
    </>
  );
}
