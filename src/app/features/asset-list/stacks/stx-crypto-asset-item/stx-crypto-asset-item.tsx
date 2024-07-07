import type { Sip10CryptoAssetFilter } from '@leather.io/query';
import { StxAvatarIcon } from '@leather.io/ui';

import type { RightElementVariant } from '@app/common/asset-list-utils';
import { CryptoAssetItemToggleLayout } from '@app/components/crypto-asset-item/crypto-asset-item-toggle.layout';
import { StxAssetItemBalanceLoader } from '@app/components/loaders/stx-balance-loader';
import type { StacksAccount } from '@app/store/accounts/blockchain/stacks/stacks-account.models';

import { StxCryptoAssetItemBalance } from '../stx-crypo-asset-item-balance/stx-crypto-asset-item-balance';

export function StxCryptoAssetItem({
  onSelectAsset,
  account,
  showStx,
  filter = 'all',
  rightElementVariant,
}: {
  showStx: boolean;
  filter?: Sip10CryptoAssetFilter;
  onSelectAsset?(symbol: string, contractId?: string): void;
  account: StacksAccount;
  rightElementVariant: RightElementVariant;
}) {
  if (!showStx || filter === 'unsupported') return null;
  if (rightElementVariant === 'toggle')
    return (
      <CryptoAssetItemToggleLayout
        captionLeft="STX"
        key="STX"
        titleLeft="Stacks"
        icon={<StxAvatarIcon />}
      />
    );
  return (
    <StxAssetItemBalanceLoader address={account.address}>
      {(balance, isLoading) => (
        <StxCryptoAssetItemBalance
          balance={balance}
          isLoading={isLoading}
          onSelectAsset={onSelectAsset}
        />
      )}
    </StxAssetItemBalanceLoader>
  );
}
