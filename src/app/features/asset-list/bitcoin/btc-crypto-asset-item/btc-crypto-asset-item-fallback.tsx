import { CryptoAssetItemLayout } from '@app/components/crypto-asset-item/crypto-asset-item.layout';
import { btcCryptoAssetPlaceholder } from '@app/query/bitcoin/btc/btc-crypto-asset.hooks';
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
      asset={btcCryptoAssetPlaceholder}
      icon={<BtcAvatarIcon />}
      name={btcCryptoAssetPlaceholder.info.name}
      rightElement={<ConnectLedgerButton chain={btcCryptoAssetPlaceholder.chain} />}
    />
  );
}
