import { HomePageSelectors } from '@tests/selectors/home.selectors';
import { css } from 'leather-styles/css';
import { Stack } from 'leather-styles/jsx';

import { copyToClipboard } from '@app/common/utils/copy-to-clipboard';
import { StxAvatar } from '@app/components/crypto-assets/stacks/components/stx-avatar';
import { StampsIcon } from '@app/ui/components/avatar-icon//stamps-icon';
import { OrdinalIcon } from '@app/ui/components/avatar-icon/ordinal-icon';

import { receiveTabStyle } from '../receive-dialog';
import { ReceiveItem } from './receive-item';

interface ReceiveCollectiblesProps {
  btcAddressTaproot: string;
  btcAddressNativeSegwit: string;
  stxAddress: string;
  onClickQrOrdinal(): void;
  onClickQrStacksNft(): void;
  onClickQrStamp(): void;
}
export function ReceiveCollectibles({
  btcAddressTaproot,
  btcAddressNativeSegwit,
  stxAddress,
  onClickQrOrdinal,
  onClickQrStacksNft,
  onClickQrStamp,
}: ReceiveCollectiblesProps) {
  return (
    <Stack className={css(receiveTabStyle)}>
      <ReceiveItem
        address={btcAddressTaproot}
        icon={<OrdinalIcon />}
        dataTestId={HomePageSelectors.ReceiveBtcTaprootQrCodeBtn}
        onCopyAddress={() => copyToClipboard(btcAddressTaproot)}
        onClickQrCode={onClickQrOrdinal}
        title="Ordinal inscription"
      />
      <ReceiveItem
        address={btcAddressNativeSegwit}
        icon={<StampsIcon />}
        onClickQrCode={onClickQrStamp}
        onCopyAddress={() => copyToClipboard(btcAddressNativeSegwit)}
        title="Bitcoin Stamp"
      />
      <ReceiveItem
        address={stxAddress}
        icon={<StxAvatar />}
        onCopyAddress={() => copyToClipboard(stxAddress)}
        onClickQrCode={onClickQrStacksNft}
        title="Stacks NFT"
      />
    </Stack>
  );
}
