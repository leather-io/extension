import { useMemo } from 'react';

import { HomePageSelectors } from '@tests/selectors/home.selectors';
import { css } from 'leather-styles/css';
import { Stack } from 'leather-styles/jsx';

import { isDefined } from '@shared/utils';

import { copyToClipboard } from '@app/common/utils/copy-to-clipboard';
import { sortAssetsBySymbol } from '@app/common/utils/sort-assets-by-symbol';
import { useToast } from '@app/features/toasts/use-toast';
import { useAlexSdkSwappableCurrencyQuery } from '@app/query/common/alex-sdk/swappable-currency.query';
import { useConfigRunesEnabled } from '@app/query/common/remote-config/remote-config.query';
import { useCurrentNetwork } from '@app/store/networks/networks.selectors';
import { Avatar, defaultFallbackDelay, getAvatarFallback } from '@app/ui/components/avatar/avatar';
import { Brc20AvatarIcon } from '@app/ui/components/avatar/brc20-avatar-icon';
import { BtcAvatarIcon } from '@app/ui/components/avatar/btc-avatar-icon';
import { RunesAvatarIcon } from '@app/ui/components/avatar/runes-avatar-icon';
import { Src20AvatarIcon } from '@app/ui/components/avatar/src20-avatar-icon';
import { StxAvatarIcon } from '@app/ui/components/avatar/stx-avatar-icon';

import { receiveTabStyle } from '../receive-dialog';
import { ReceiveItem } from './receive-item';

interface ReceiveTokensProps {
  btcAddressNativeSegwit: string;
  btcAddressTaproot: string;
  stxAddress: string;
  onClickQrBtc(): void;
  onClickQrStx(): void;
}
export function ReceiveTokens({
  btcAddressNativeSegwit,
  btcAddressTaproot,
  stxAddress,
  onClickQrBtc,
  onClickQrStx,
}: ReceiveTokensProps) {
  const toast = useToast();
  const network = useCurrentNetwork();
  const runesEnabled = useConfigRunesEnabled();
  const { data: supportedCurrencies = [] } = useAlexSdkSwappableCurrencyQuery();

  const receivableAssets = useMemo(
    () =>
      sortAssetsBySymbol(supportedCurrencies.filter(isDefined))
        .filter(asset => asset.name !== 'STX')
        .map(asset => ({
          address: stxAddress,
          fallback: getAvatarFallback(asset.name),
          icon: asset.icon,
          name: asset.name,
        })),
    [stxAddress, supportedCurrencies]
  );
  return (
    <Stack className={css(receiveTabStyle)}>
      <ReceiveItem
        address={btcAddressNativeSegwit}
        icon={<BtcAvatarIcon />}
        dataTestId={HomePageSelectors.ReceiveBtcNativeSegwitQrCodeBtn}
        onCopyAddress={async () => {
          await copyToClipboard(btcAddressNativeSegwit);
          toast.success('Copied to clipboard!');
        }}
        onClickQrCode={onClickQrBtc}
        title="Bitcoin (BTC)"
      />
      <ReceiveItem
        address={stxAddress}
        icon={<StxAvatarIcon />}
        dataTestId={HomePageSelectors.ReceiveStxQrCodeBtn}
        onCopyAddress={async () => {
          await copyToClipboard(stxAddress);
          toast.success('Copied to clipboard!');
        }}
        onClickQrCode={onClickQrStx}
        title="Stacks (STX)"
      />
      <ReceiveItem
        address={btcAddressTaproot}
        icon={<Brc20AvatarIcon />}
        dataTestId={HomePageSelectors.ReceiveBtcTaprootQrCodeBtn}
        onCopyAddress={async () => {
          await copyToClipboard(btcAddressTaproot);
          toast.success('Copied to clipboard!');
        }}
        // onClickQrCode={onClickQrOrdinal}
        title="BRC-20"
      />
      <ReceiveItem
        address={btcAddressNativeSegwit}
        icon={<Src20AvatarIcon />}
        // onClickQrCode={onClickQrStamp}
        onCopyAddress={async () => {
          await copyToClipboard(btcAddressNativeSegwit);
          toast.success('Copied to clipboard!');
        }}
        title="SRC-20"
      />
      {(network.chain.bitcoin.bitcoinNetwork === 'testnet' || runesEnabled) && (
        <ReceiveItem
          address={btcAddressTaproot}
          icon={<RunesAvatarIcon />}
          // onClickQrCode={onClickQrStamp}
          onCopyAddress={async () => {
            await copyToClipboard(btcAddressTaproot);
            toast.success('Copied to clipboard!');
          }}
          title="Runes"
        />
      )}

      {receivableAssets.map(asset => (
        <ReceiveItem
          key={asset.name}
          address={asset.address}
          icon={
            <Avatar.Root>
              <Avatar.Image alt={asset.fallback} src={asset.icon} />
              <Avatar.Fallback delayMs={defaultFallbackDelay}>{asset.fallback}</Avatar.Fallback>
            </Avatar.Root>
          }
          // onClickQrCode={() => null}
          onCopyAddress={async () => {
            await copyToClipboard(asset.address);
            toast.success('Copied to clipboard!');
          }}
          title={asset.name}
        />
      ))}
    </Stack>
  );
}
