import { Box, Stack, StackProps } from '@stacks/ui';
import { HomePageSelectorsLegacy } from '@tests-legacy/page-objects/home.selectors';

import { CryptoCurrencyAssetItem } from '@app/components/crypto-assets/crypto-currency-asset/crypto-currency-asset-item';
import { StxAvatar } from '@app/components/crypto-assets/stacks/components/stx-avatar';
import { BtcIcon } from '@app/components/icons/btc-icon';
import { LoadingSpinner } from '@app/components/loading-spinner';
import { useBitcoinAssetBalance } from '@app/query/bitcoin/address/address.hooks';
import { useConfigBitcoinEnabled } from '@app/query/common/hiro-config/hiro-config.query';
import {
  useStacksAnchoredCryptoCurrencyAssetBalance,
  useStacksFungibleTokenAssetBalancesAnchoredWithMetadata,
  useStacksUnanchoredCryptoCurrencyAssetBalance,
} from '@app/query/stacks/balance/crypto-asset-balances.hooks';
import { useCurrentBtcNativeSegwitAccountAddressIndexZero } from '@app/store/accounts/blockchain/bitcoin/native-segwit-account.hooks';

import { Collectibles } from '../collectibles/collectibles';
import { StacksFungibleTokenAssetList } from './components/stacks-fungible-token-asset-list';

interface BalancesListProps extends StackProps {
  address: string;
}
export function BalancesList({ address, ...props }: BalancesListProps) {
  const { data: stxAssetBalance } = useStacksAnchoredCryptoCurrencyAssetBalance(address);
  const { data: stxUnachoredAssetBalance } = useStacksUnanchoredCryptoCurrencyAssetBalance(address);
  const bitcoinAddress = useCurrentBtcNativeSegwitAccountAddressIndexZero();
  const btcAssetBalance = useBitcoinAssetBalance(bitcoinAddress);
  const stacksFtAssetBalances = useStacksFungibleTokenAssetBalancesAnchoredWithMetadata(address);
  const isBitcoinEnabled = useConfigBitcoinEnabled();

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
        <CryptoCurrencyAssetItem assetBalance={btcAssetBalance} icon={<Box as={BtcIcon} />} />
      )}

      <CryptoCurrencyAssetItem
        assetBalance={stxAssetBalance}
        assetSubBalance={stxUnachoredAssetBalance}
        icon={<StxAvatar {...props} />}
      />

      <StacksFungibleTokenAssetList assetBalances={stacksFtAssetBalances} />
      <Collectibles />
    </Stack>
  );
}
