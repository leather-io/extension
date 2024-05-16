import { createMoney } from '@shared/models/money.model';

import { CryptoAssetItemLayout } from '@app/components/crypto-asset-item/crypto-asset-item.layout';
import { useCheckLedgerBlockchainAvailable } from '@app/store/accounts/blockchain/utils';
import { StxAvatarIcon } from '@app/ui/components/avatar/stx-avatar-icon';

import type { AssetListVariant } from '../../asset-list';
import { ConnectLedgerButton } from '../../components/connect-ledger-asset-button';

interface StxCryptoAssetItemFallbackProps {
  variant: AssetListVariant;
}
export function StxCryptoAssetItemFallback({ variant }: StxCryptoAssetItemFallbackProps) {
  const checkBlockchainAvailable = useCheckLedgerBlockchainAvailable();
  if (variant === 'interactive' && !checkBlockchainAvailable('stacks')) return null;
  return (
    <CryptoAssetItemLayout
      balance={{ availableBalance: createMoney(0, 'STX') }}
      icon={<StxAvatarIcon />}
      name="stacks"
      rightElement={<ConnectLedgerButton chain="stacks" />}
      symbol="STX"
    />
  );
}
