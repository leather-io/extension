import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

import { Box, Stack, StackProps } from '@stacks/ui';

import { BITCOIN_TEST_ADDRESS } from '@shared/constants';
import { RouteUrls } from '@shared/route-urls';

import { CryptoCurrencyAssetItem } from '@app/components/crypto-assets/crypto-currency-asset/crypto-currency-asset-item';
import { StxAvatar } from '@app/components/crypto-assets/stacks/components/stx-avatar';
import { BtcIcon } from '@app/components/icons/btc-icon';
import { useBitcoinCryptoCurrencyAssetBalance } from '@app/query/bitcoin/address/address.hooks';
import {
  useStacksCryptoCurrencyAssetBalance,
  useStacksFungibleTokenAssetBalances,
  useStacksNonFungibleTokenAssetsUnanchored,
} from '@app/query/stacks/balance/crypto-asset-balances.hooks';

import { FundAccount } from './components/fund-account';
import { StacksFungibleTokenAssetList } from './components/stacks-fungible-token-asset-list';
import { StacksNonFungibleTokenAssetList } from './components/stacks-non-fungible-token-asset-list';

interface BalancesListProps extends StackProps {
  address: string;
}
export const BalancesList = ({ address, ...props }: BalancesListProps) => {
  const stxAssetBalance = useStacksCryptoCurrencyAssetBalance();
  const btcAssetBalance = useBitcoinCryptoCurrencyAssetBalance(BITCOIN_TEST_ADDRESS);
  const stacksFtAssetBalances = useStacksFungibleTokenAssetBalances();
  const { data: stacksNftAssetBalances = [] } = useStacksNonFungibleTokenAssetsUnanchored();
  const navigate = useNavigate();

  const handleFundAccount = useCallback(() => navigate(RouteUrls.Fund), [navigate]);

  const noAssets =
    btcAssetBalance.balance.amount.isEqualTo(0) &&
    stxAssetBalance.balance.amount.isEqualTo(0) &&
    stacksFtAssetBalances.length === 0 &&
    stacksNftAssetBalances.length === 0;

  if (noAssets) return <FundAccount onFundAccount={handleFundAccount} {...props} />;

  return (
    <Stack pb="extra-loose" spacing="extra-loose" {...props}>
      {btcAssetBalance.balance.amount.isGreaterThan(0) && (
        <CryptoCurrencyAssetItem assetBalance={btcAssetBalance} icon={<Box as={BtcIcon} />} />
      )}
      {stxAssetBalance.balance.amount.isGreaterThan(0) && (
        <CryptoCurrencyAssetItem assetBalance={stxAssetBalance} icon={<StxAvatar {...props} />} />
      )}
      <StacksFungibleTokenAssetList assetBalances={stacksFtAssetBalances} />
      <StacksNonFungibleTokenAssetList assetBalances={stacksNftAssetBalances} />
    </Stack>
  );
};
