import { HomePageSelectors } from '@tests/selectors/home.selectors';
import { css } from 'leather-styles/css';
import { Stack } from 'leather-styles/jsx';

import { copyToClipboard } from '@app/common/utils/copy-to-clipboard';
import { BtcAvatarIcon } from '@app/ui/components/avatar/btc-avatar-icon';
import { StxAvatarIcon } from '@app/ui/components/avatar/stx-avatar-icon';

import { receiveTabStyle } from '../receive-dialog';
import { ReceiveItem } from './receive-item';

interface ReceiveTokensProps {
  btcAddressNativeSegwit: string;
  stxAddress: string;
  onClickQrBtc(): void;
  onClickQrStx(): void;
}
export function ReceiveTokens({
  btcAddressNativeSegwit,
  stxAddress,
  onClickQrBtc,
  onClickQrStx,
}: ReceiveTokensProps) {
  return (
    <Stack className={css(receiveTabStyle)}>
      <ReceiveItem
        address={btcAddressNativeSegwit}
        icon={<BtcAvatarIcon />}
        dataTestId={HomePageSelectors.ReceiveBtcNativeSegwitQrCodeBtn}
        onCopyAddress={() => copyToClipboard(btcAddressNativeSegwit)}
        onClickQrCode={onClickQrBtc}
        title="Bitcoin"
      />
      <ReceiveItem
        address={stxAddress}
        icon={<StxAvatarIcon />}
        dataTestId={HomePageSelectors.ReceiveStxQrCodeBtn}
        onCopyAddress={() => copyToClipboard(stxAddress)}
        onClickQrCode={onClickQrStx}
        title="Stacks"
      />
    </Stack>
  );
}
