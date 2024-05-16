import { createMoney } from '@shared/models/money.model';

import { CryptoAssetItemLayout } from '@app/components/crypto-asset-item/crypto-asset-item.layout';
import { useCheckLedgerBlockchainAvailable } from '@app/store/accounts/blockchain/utils';
import { BtcAvatarIcon } from '@app/ui/components/avatar/btc-avatar-icon';

import type { AssetListVariant } from '../../asset-list';
import { ConnectLedgerButton } from '../../components/connect-ledger-asset-button';

interface StxCryptoAssetItemFallbackProps {
  variant: AssetListVariant;
}
export function BtcCryptoAssetItemFallback({ variant }: StxCryptoAssetItemFallbackProps) {
  const checkBlockchainAvailable = useCheckLedgerBlockchainAvailable();
  if (variant === 'interactive' && !checkBlockchainAvailable('bitcoin')) return null;
  return (
    <CryptoAssetItemLayout
      balance={{ availableBalance: createMoney(0, 'BTC') }}
      icon={<BtcAvatarIcon />}
      name="bitcoin"
      rightElement={<ConnectLedgerButton chain="bitcoin" />}
      symbol="BTC"
    />
  );
}
