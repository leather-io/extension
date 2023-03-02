import { Box, Stack, StackProps } from '@stacks/ui';
import { HomePageSelectorsLegacy } from '@tests-legacy/page-objects/home.selectors';

import { useBtcAssetBalance } from '@app/common/hooks/balance/use-btc-balance';
import { useStxAssetBalance } from '@app/common/hooks/balance/use-stx-balance';
import { CryptoCurrencyAssetItem } from '@app/components/crypto-assets/crypto-currency-asset/crypto-currency-asset-item';
import { StxAvatar } from '@app/components/crypto-assets/stacks/components/stx-avatar';
import { BtcIcon } from '@app/components/icons/btc-icon';
import { LoadingSpinner } from '@app/components/loading-spinner';
import { useConfigBitcoinEnabled } from '@app/query/common/hiro-config/hiro-config.query';
import {
  useStacksFungibleTokenAssetBalancesAnchoredWithMetadata,
  useStacksUnanchoredCryptoCurrencyAssetBalance,
} from '@app/query/stacks/balance/crypto-asset-balances.hooks';

import { Collectibles } from '../collectibles/collectibles';
import { StacksFungibleTokenAssetList } from './components/stacks-fungible-token-asset-list';

interface BalancesListProps extends StackProps {
  address: string;
}
export function BalancesList({ address, ...props }: BalancesListProps) {
  const { data: stxUnachoredAssetBalance } = useStacksUnanchoredCryptoCurrencyAssetBalance(address);
  const stacksFtAssetBalances = useStacksFungibleTokenAssetBalancesAnchoredWithMetadata(address);
  const isBitcoinEnabled = useConfigBitcoinEnabled();
  const { stxUsdBalance, stxAssetBalance } = useStxAssetBalance(address);
  const { btcAddress, btcAssetBalance, btcUsdBalance } = useBtcAssetBalance();

  // Better handle loading state
  if (!stxAssetBalance || !stxUnachoredAssetBalance) return <LoadingSpinner />;

  return (
    <Stack
      pb="extra-loose"
      spacing="extra-loose"
      data-testid={HomePageSelectorsLegacy.BalancesList}
      {...props}
    >
      {isBitcoinEnabled && (
        <CryptoCurrencyAssetItem
          assetBalance={btcAssetBalance}
          usdBalance={btcUsdBalance}
          icon={<Box as={BtcIcon} />}
          address={btcAddress}
        />
      )}

      <CryptoCurrencyAssetItem
        assetBalance={stxAssetBalance}
        usdBalance={stxUsdBalance}
        assetSubBalance={stxUnachoredAssetBalance}
        address={address}
        icon={<StxAvatar {...props} />}
        isPressable
        canCopy
      />

      <StacksFungibleTokenAssetList assetBalances={stacksFtAssetBalances} />
      <Collectibles />
    </Stack>
  );
}
