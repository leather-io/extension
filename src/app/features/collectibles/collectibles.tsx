import { Flex, Grid, Spinner, color } from '@stacks/ui';
import { useIsFetching, useQueryClient } from '@tanstack/react-query';

import { useWalletType } from '@app/common/use-wallet-type';
import { sumNumbers } from '@app/common/utils';
import { Refresh } from '@app/components/icons/refresh-icon';
import { Caption } from '@app/components/typography';
import { useConfigNftMetadataEnabled } from '@app/query/common/hiro-config/hiro-config.query';
import { QueryPrefixes } from '@app/query/query-prefixes';

import { AddCollectible } from './components/add-collectible';
import { Ordinals } from './components/ordinals';
import { StacksCryptoAssets } from './components/stacks-crypto-assets';

function isSomeQueryFetching(...args: number[]) {
  return sumNumbers(args).toNumber() > 0;
}

function useIsFetchingCollectiblesRelatedQuery() {
  // Ordinal inscriptions
  const n1 = useIsFetching([QueryPrefixes.TaprootAddressUtxosMetadata]);
  const n2 = useIsFetching([QueryPrefixes.InscriptionFromUtxo]);
  const n3 = useIsFetching([QueryPrefixes.InscriptionMetadata]);
  const n4 = useIsFetching([QueryPrefixes.OrdinalTextContent]);
  const n5 = useIsFetching([QueryPrefixes.InscriptionFromTxid]);

  // BNS
  const n6 = useIsFetching([QueryPrefixes.BnsNamesByAddress]);

  // NFTs
  const n7 = useIsFetching([QueryPrefixes.GetNftMetadata]);

  return isSomeQueryFetching(n1, n2, n3, n4, n5, n6, n7);
}

export function Collectibles() {
  const { whenWallet } = useWalletType();
  const isNftMetadataEnabled = useConfigNftMetadataEnabled();
  const queryClient = useQueryClient();

  const isFetching = useIsFetchingCollectiblesRelatedQuery();

  return (
    <>
      <Flex flexDirection="row" justifyContent="left" columnGap="8px">
        <Caption>Collectibles</Caption>
        {isFetching ? (
          <Spinner color={color('text-caption')} opacity={0.5} size="16px" />
        ) : (
          <Refresh
            cursor="pointer"
            onClick={() => {
              queryClient.refetchQueries({ type: 'active' });
            }}
          />
        )}
      </Flex>
      <Grid
        gap="base"
        rowGap="extra-loose"
        templateColumns={[
          'repeat(auto-fill, minmax(164px, 1fr))',
          'repeat(auto-fill, minmax(184px, 1fr))',
        ]}
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
      </Grid>
    </>
  );
}
