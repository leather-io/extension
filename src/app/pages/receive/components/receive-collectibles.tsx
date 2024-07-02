import { HomePageSelectors } from '@tests/selectors/home.selectors';
import { css } from 'leather-styles/css';
import { Stack } from 'leather-styles/jsx';

import { OrdinalAvatarIcon, StxAvatarIcon } from '@leather.io/ui';

import { copyToClipboard } from '@app/common/utils/copy-to-clipboard';
import { useToast } from '@app/features/toasts/use-toast';
import { StampsAvatarIcon } from '@app/ui/components/avatar/stamps-avatar-icon';

import { receiveTabStyle } from '../receive-dialog';
import { ReceiveItem } from './receive-item';

interface ReceiveCollectiblesProps {
  btcAddressNativeSegwit: string;
  btcAddressTaproot: string;
  stxAddress: string;
  onClickQrOrdinal(): void;
  onClickQrStacksNft(): void;
  onClickQrStamp(): void;
}
export function ReceiveCollectibles({
  btcAddressNativeSegwit,
  btcAddressTaproot,
  stxAddress,
  onClickQrOrdinal,
  onClickQrStacksNft,
  onClickQrStamp,
}: ReceiveCollectiblesProps) {
  const toast = useToast();
  return (
    <Stack className={css(receiveTabStyle)}>
      <ReceiveItem
        address={btcAddressTaproot}
        icon={<OrdinalAvatarIcon />}
        dataTestId={HomePageSelectors.ReceiveBtcTaprootQrCodeBtn}
        onCopyAddress={async () => {
          await copyToClipboard(btcAddressTaproot);
          toast.success('Copied to clipboard!');
        }}
        onClickQrCode={onClickQrOrdinal}
        title="Ordinal inscription"
      />
      <ReceiveItem
        address={btcAddressNativeSegwit}
        icon={<StampsAvatarIcon />}
        onClickQrCode={onClickQrStamp}
        onCopyAddress={async () => {
          await copyToClipboard(btcAddressNativeSegwit);
          toast.success('Copied to clipboard!');
        }}
        title="Bitcoin Stamp"
      />
      <ReceiveItem
        address={stxAddress}
        icon={<StxAvatarIcon />}
        onCopyAddress={async () => {
          await copyToClipboard(stxAddress);
          toast.success('Copied to clipboard!');
        }}
        onClickQrCode={onClickQrStacksNft}
        title="Stacks NFT"
      />
    </Stack>
  );
}
