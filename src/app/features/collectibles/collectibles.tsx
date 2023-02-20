import { Box, Grid } from '@stacks/ui';

import { Caption } from '@app/components/typography';
import { useGetOrdinalsQuery } from '@app/query/bitcoin/ordinals/ordinals.query';

import { AddCollectibles } from './add-collectibles';
import { StacksCryptoAssets } from './components/stacks-crypto-assets';
import { Ordinals } from './ordinals';

export function Collectibles() {
  const ordinalsQuery = useGetOrdinalsQuery();

  return (
    <Box>
      <Caption pb="base-loose">Collectibles</Caption>
      <Grid
        gap={['base', 'base', '48px']}
        templateColumns={['repeat(2, 2fr)', 'repeat(2, 2fr)', 'repeat(3, 1fr)']}
      >
        <AddCollectibles />
        <Ordinals query={ordinalsQuery} />
        <StacksCryptoAssets />
      </Grid>
    </Box>
  );
}
