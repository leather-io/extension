import { CryptoAssetItemLayout } from '@app/components/crypto-asset-item/crypto-asset-item.layout';
import { stxCryptoAssetPlaceholder } from '@app/query/stacks/stx/stx-crypto-asset.hooks';
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
      asset={stxCryptoAssetPlaceholder}
      icon={<StxAvatarIcon />}
      name={stxCryptoAssetPlaceholder.info.name}
      rightElement={<ConnectLedgerButton chain={stxCryptoAssetPlaceholder.chain} />}
    />
  );
}
