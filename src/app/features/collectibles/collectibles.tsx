import { useQueryClient } from '@tanstack/react-query';

import { useWalletType } from '@app/common/use-wallet-type';
import { useCurrentTaprootAccountBalance } from '@app/query/bitcoin/balance/bitcoin-balances.query';
import { useConfigNftMetadataEnabled } from '@app/query/common/hiro-config/hiro-config.query';

import { AddCollectible } from './components/add-collectible';
import { CollectiblesLayout } from './components/collectibes.layout';
import { Ordinals } from './components/ordinals';
import { StacksCryptoAssets } from './components/stacks-crypto-assets';
import { TaprootBalanceDisplayer } from './components/taproot-balance-displayer';
import { useIsFetchingCollectiblesRelatedQuery } from './use-is-fetching-collectibles';

export function Collectibles() {
  const { whenWallet } = useWalletType();
  const isNftMetadataEnabled = useConfigNftMetadataEnabled();
  const queryClient = useQueryClient();
  const taprootBalance = useCurrentTaprootAccountBalance();
  const isFetching = useIsFetchingCollectiblesRelatedQuery();

  return (
    <CollectiblesLayout
      title="Collectibles"
      subHeader={<TaprootBalanceDisplayer balance={taprootBalance} />}
      isLoading={isFetching}
      onRefresh={() => void queryClient.refetchQueries({ type: 'active' })}
    >
      {whenWallet({
        software: (
          <>
            <AddCollectible />
            <Ordinals />
          </>
        ),
        ledger: null,
      })}
      {isNftMetadataEnabled ? <StacksCryptoAssets /> : null}
    </CollectiblesLayout>
  );
}
