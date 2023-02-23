import { Grid } from '@stacks/ui';

import { useWalletType } from '@app/common/use-wallet-type';
import { Caption } from '@app/components/typography';
import { useConfigNftMetadataEnabled } from '@app/query/common/hiro-config/hiro-config.query';

import { AddCollectible } from './components/add-collectible';
import { Ordinals } from './components/ordinals';
import { StacksCryptoAssets } from './components/stacks-crypto-assets';

export function Collectibles() {
  const { whenWallet } = useWalletType();
  const isNftMetadataEnabled = useConfigNftMetadataEnabled();

  return (
    <>
      <Caption>Collectibles</Caption>
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
