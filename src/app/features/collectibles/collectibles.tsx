import { useNavigate } from 'react-router-dom';

import { useQueryClient } from '@tanstack/react-query';

import { RouteUrls } from '@shared/route-urls';

import { useWalletType } from '@app/common/use-wallet-type';
import { useConfigNftMetadataEnabled } from '@app/query/common/hiro-config/hiro-config.query';

import { AddCollectible } from './components/add-collectible';
import { Ordinals } from './components/bitcoin/ordinals';
import { CollectiblesLayout } from './components/collectibes.layout';
import { StacksCryptoAssets } from './components/stacks/stacks-crypto-assets';
import { TaprootBalanceDisplayer } from './components/taproot-balance-displayer';
import { useIsFetchingCollectiblesRelatedQuery } from './hooks/use-is-fetching-collectibles';

export function Collectibles() {
  const { whenWallet } = useWalletType();
  const navigate = useNavigate();
  const isNftMetadataEnabled = useConfigNftMetadataEnabled();
  const queryClient = useQueryClient();
  const isFetching = useIsFetchingCollectiblesRelatedQuery();

  return (
    <CollectiblesLayout
      title="Collectibles"
      subHeader={whenWallet({
        software: (
          <TaprootBalanceDisplayer
            onSelectRetrieveBalance={() => navigate(RouteUrls.RetriveTaprootFunds)}
          />
        ),
        ledger: null,
      })}
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
