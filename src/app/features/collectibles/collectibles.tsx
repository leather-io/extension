import { Flex, Grid, Spinner, color } from '@stacks/ui';
import { useIsFetching, useQueryClient } from '@tanstack/react-query';

import { useWalletType } from '@app/common/use-wallet-type';
import { Refresh } from '@app/components/icons/refresh';
import { Caption } from '@app/components/typography';
import { useConfigNftMetadataEnabled } from '@app/query/common/hiro-config/hiro-config.query';
import { QueryPrefixes } from '@app/query/query-prefixes';

import { AddCollectible } from './components/add-collectible';
import { Ordinals } from './components/ordinals';
import { StacksCryptoAssets } from './components/stacks-crypto-assets';

function isFetchingCollectiblesRelatedQuery(...args: number[]) {
  return args.reduce((acc, curr) => acc + curr, 0) > 0;
}

export function Collectibles() {
  const { whenWallet } = useWalletType();
  const isNftMetadataEnabled = useConfigNftMetadataEnabled();
  const queryClient = useQueryClient();

  // Ordinal inscriptions
  const n1 = useIsFetching([QueryPrefixes.TaprootAddressUtxosMetadata]);
  const n2 = useIsFetching([QueryPrefixes.InscriptionFromUtxo]);
  const n3 = useIsFetching([QueryPrefixes.InscriptionMetadata]);
  const n4 = useIsFetching([QueryPrefixes.OrdinalTextContent]);

  // BNS
  const n5 = useIsFetching([QueryPrefixes.BnsNamesByAddress]);

  // NFTs
  const n6 = useIsFetching([QueryPrefixes.GetNftMetadata]);

  return (
    <>
      <Flex flexDirection="row" justifyContent="left" columnGap="8px">
        <Caption>Collectibles</Caption>
        {isFetchingCollectiblesRelatedQuery(n1, n2, n3, n4, n5, n6) ? (
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
