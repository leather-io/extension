import { HomePageSelectors } from '@tests/selectors/home.selectors';
import { css } from 'leather-styles/css';
import { Stack } from 'leather-styles/jsx';

import { copyToClipboard } from '@app/common/utils/copy-to-clipboard';
import { OrdinalAvatarIcon } from '@app/ui/components/avatar/ordinal-avatar-icon';
import { StampsAvatarIcon } from '@app/ui/components/avatar/stamps-avatar-icon';
import { StxAvatarIcon } from '@app/ui/components/avatar/stx-avatar-icon';

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
        icon={<OrdinalAvatarIcon />}
        dataTestId={HomePageSelectors.ReceiveBtcTaprootQrCodeBtn}
        onCopyAddress={() => copyToClipboard(btcAddressTaproot)}
        onClickQrCode={onClickQrOrdinal}
        title="Ordinal inscription"
      />
      <ReceiveItem
        address={btcAddressNativeSegwit}
        icon={<StampsAvatarIcon />}
        onClickQrCode={onClickQrStamp}
        onCopyAddress={() => copyToClipboard(btcAddressNativeSegwit)}
        title="Bitcoin Stamp"
      />
      <ReceiveItem
        address={stxAddress}
        icon={<StxAvatarIcon />}
        onCopyAddress={() => copyToClipboard(stxAddress)}
        onClickQrCode={onClickQrStacksNft}
        title="Stacks NFT"
      />
    </Stack>
  );
}
