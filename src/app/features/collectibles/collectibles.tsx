import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { useQueryClient } from '@tanstack/react-query';

import { RouteUrls } from '@shared/route-urls';

import { useWalletType } from '@app/common/use-wallet-type';
import { CurrentBitcoinAccountLoader } from '@app/components/loaders/bitcoin-account-loader';
import { CurrentStacksAccountLoader } from '@app/components/loaders/stacks-account-loader';
import { useConfigNftMetadataEnabled } from '@app/query/common/remote-config/remote-config.query';

import { AddCollectible } from './components/add-collectible';
import { Ordinals } from './components/bitcoin/ordinals';
import { Stamps } from './components/bitcoin/stamps';
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
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  return (
    <CollectiblesLayout
      title="Collectibles"
      subHeader={whenWallet({
        software: (
          <TaprootBalanceDisplayer
            onSelectRetrieveBalance={() =>
              navigate(RouteUrls.RetrieveTaprootFunds, {
                state: {
                  backgroundLocation: { pathname: RouteUrls.Home },
                },
              })
            }
          />
        ),
        ledger: null,
      })}
      isLoading={isFetching}
      isLoadingMore={isLoadingMore}
      onRefresh={() => void queryClient.refetchQueries({ type: 'active' })}
    >
      <CurrentBitcoinAccountLoader>{() => <AddCollectible />}</CurrentBitcoinAccountLoader>

      {isNftMetadataEnabled && (
        <CurrentStacksAccountLoader>
          {account => <StacksCryptoAssets account={account} />}
        </CurrentStacksAccountLoader>
      )}

      <CurrentBitcoinAccountLoader>
        {() => (
          <>
            <Stamps />
            <Ordinals setIsLoadingMore={setIsLoadingMore} />
          </>
        )}
      </CurrentBitcoinAccountLoader>
    </CollectiblesLayout>
  );
}
