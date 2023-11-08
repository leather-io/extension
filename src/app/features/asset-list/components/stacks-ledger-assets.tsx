import { useStxBalance } from '@app/common/hooks/balance/stx/use-stx-balance';
import { CryptoCurrencyAssetItem } from '@app/components/crypto-assets/crypto-currency-asset/crypto-currency-asset-item';
import { StxAvatar } from '@app/components/crypto-assets/stacks/components/stx-avatar';
import { useStacksFungibleTokenAssetBalancesAnchoredWithMetadata } from '@app/query/stacks/balance/stacks-ft-balances.hooks';
import { useCurrentStacksAccount } from '@app/store/accounts/blockchain/stacks/stacks-account.hooks';
import { useHasStacksLedgerKeychain } from '@app/store/accounts/blockchain/stacks/stacks.hooks';

import { ConnectLedgerAssetBtn } from './connect-ledger-asset-button';
import { StacksFungibleTokenAssetList } from './stacks-fungible-token-asset-list';

export function StacksLedgerAssetsList() {
  const hasStacksKeys = useHasStacksLedgerKeychain();
  const currentAccount = useCurrentStacksAccount();
  const { stxEffectiveBalance, stxEffectiveUsdBalance } = useStxBalance();
  const stacksFtAssetBalances = useStacksFungibleTokenAssetBalancesAnchoredWithMetadata(
    currentAccount?.address || ''
  );
  return (
    <>
      <CryptoCurrencyAssetItem
        assetBalance={stxEffectiveBalance}
        usdBalance={stxEffectiveUsdBalance}
        icon={<StxAvatar />}
        address={currentAccount?.address || ''}
        rightElement={hasStacksKeys ? undefined : <ConnectLedgerAssetBtn chain="stacks" />}
      />
      <StacksFungibleTokenAssetList assetBalances={stacksFtAssetBalances} />
    </>
  );
}
