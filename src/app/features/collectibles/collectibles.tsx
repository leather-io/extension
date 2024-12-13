import { useNavigate } from 'react-router-dom';

import { useQueryClient } from '@tanstack/react-query';

import { RouteUrls } from '@shared/route-urls';

import { useWalletType } from '@app/common/use-wallet-type';
import { CurrentBitcoinSignerLoader } from '@app/components/loaders/current-bitcoin-signer-loader';
import { CurrentStacksAccountLoader } from '@app/components/loaders/stacks-account-loader';
import { useConfigNftMetadataEnabled } from '@app/query/common/remote-config/remote-config.query';

import { CollectiblesLayout } from '../../components/collectibles/collectible.layout';
import { AddCollectible } from './components/add-collectible';
import { Ordinals } from './components/bitcoin/ordinals';
import { Stamps } from './components/bitcoin/stamps';
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
      onRefresh={() => void queryClient.refetchQueries({ type: 'active' })}
    >
      <CurrentBitcoinSignerLoader>{() => <AddCollectible />}</CurrentBitcoinSignerLoader>

      {isNftMetadataEnabled && (
        <CurrentStacksAccountLoader>
          {account => <StacksCryptoAssets address={account?.address ?? ''} />}
        </CurrentStacksAccountLoader>
      )}

      <CurrentBitcoinSignerLoader>
        {() => (
          <>
            <Stamps />
            <Ordinals />
          </>
        )}
      </CurrentBitcoinSignerLoader>
    </CollectiblesLayout>
  );
}
