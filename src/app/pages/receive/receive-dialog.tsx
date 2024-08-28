import { useLocation, useNavigate } from 'react-router-dom';

import { HomePageSelectors } from '@tests/selectors/home.selectors';
import { Box } from 'leather-styles/jsx';
import get from 'lodash.get';

import { Sheet, SheetHeader, Tabs } from '@leather.io/ui';

import { RouteUrls } from '@shared/route-urls';
import { analytics } from '@shared/utils/analytics';

import { useLocationState } from '@app/common/hooks/use-location-state';
import { useBackgroundLocationRedirect } from '@app/routes/hooks/use-background-location-redirect';
import { useZeroIndexTaprootAddress } from '@app/store/accounts/blockchain/bitcoin/bitcoin.hooks';
import { useCurrentAccountNativeSegwitAddressIndexZero } from '@app/store/accounts/blockchain/bitcoin/native-segwit-account.hooks';
import { useCurrentStacksAccountAddress } from '@app/store/accounts/blockchain/stacks/stacks-account.hooks';

import { ReceiveCollectibles } from './components/receive-collectibles';
import { ReceiveTokens } from './components/receive-tokens';

type ReceiveSheet = 'full' | 'collectible';

export const receiveTabStyle = {
  mt: 'space.03',
  paddingX: 'space.05',
  pb: 'space.05',
  minHeight: '260px',
};

interface ReceiveSheetProps {
  type?: 'full' | 'collectible';
}

export function ReceiveSheet({ type = 'full' }: ReceiveSheetProps) {
  useBackgroundLocationRedirect();

  const backgroundLocation = useLocationState<Location>('backgroundLocation');
  const navigate = useNavigate();
  const location = useLocation();
  const btcAddressNativeSegwit = useCurrentAccountNativeSegwitAddressIndexZero();
  const stxAddress = useCurrentStacksAccountAddress();
  const accountIndex = get(location.state, 'accountIndex', undefined);
  const btcAddressTaproot = useZeroIndexTaprootAddress(accountIndex);

  const title =
    type === 'full' ? (
      <>
        Choose asset <br /> to receive
      </>
    ) : (
      <>
        Receive <br /> collectible
      </>
    );

  function Collectibles() {
    return (
      <ReceiveCollectibles
        btcAddressTaproot={btcAddressTaproot}
        btcAddressNativeSegwit={btcAddressNativeSegwit}
        stxAddress={stxAddress}
        onClickQrOrdinal={() => {
          void analytics.track('select_inscription_to_add_new_collectible');
          navigate(`${RouteUrls.Home}${RouteUrls.ReceiveCollectibleOrdinal}`, {
            state: {
              btcAddressTaproot,
              backgroundLocation,
            },
          });
        }}
        onClickQrStamp={() =>
          navigate(`${RouteUrls.Home}${RouteUrls.ReceiveBtcStamp}`, {
            state: { backgroundLocation },
          })
        }
        onClickQrStacksNft={() =>
          navigate(`${RouteUrls.Home}${RouteUrls.ReceiveStx}`, {
            state: { backgroundLocation },
          })
        }
      />
    );
  }

  return (
    <Sheet
      header={
        <SheetHeader
          variant="large"
          title={title}
          onClose={() => navigate(backgroundLocation ?? '..')}
        />
      }
      onClose={() => navigate(backgroundLocation ?? '..')}
      isShowing
    >
      {type === 'collectible' && <Collectibles />}
      {type === 'full' && (
        <Tabs.Root defaultValue="tokens">
          <Tabs.List>
            <Tabs.Trigger value="tokens" data-testid={HomePageSelectors.ReceiveAssetsTab}>
              Tokens
            </Tabs.Trigger>
            <Tabs.Trigger
              value="collectibles"
              data-testid={HomePageSelectors.ReceiveCollectiblesTab}
            >
              Collectibles
            </Tabs.Trigger>
          </Tabs.List>
          <Tabs.Content value="tokens">
            {/* FIXME 96px should be sizes.footerHeight */}
            <Box mb={{ base: '96px', md: 'unset' }}>
              <ReceiveTokens
                btcAddressNativeSegwit={btcAddressNativeSegwit}
                stxAddress={stxAddress}
                btcAddressTaproot={btcAddressTaproot}
                onClickQrBtc={() =>
                  navigate(`${RouteUrls.Home}${RouteUrls.ReceiveBtc}`, {
                    state: { backgroundLocation },
                  })
                }
                onClickQrStx={() =>
                  navigate(`${RouteUrls.Home}${RouteUrls.ReceiveStx}`, {
                    state: { backgroundLocation, btcAddressTaproot },
                  })
                }
              />
            </Box>
          </Tabs.Content>
          <Tabs.Content value="collectibles">
            <Collectibles />
          </Tabs.Content>
        </Tabs.Root>
      )}
    </Sheet>
  );
}
