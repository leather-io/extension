import { Outlet } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

import { Box, Stack, Text } from '@stacks/ui';
import { HomePageSelectorsLegacy } from '@tests-legacy/page-objects/home.selectors';

import { LEDGER_BITCOIN_ENABLED } from '@shared/environment';

import { useBtcAssetBalance } from '@app/common/hooks/balance/btc/use-btc-balance';
import { useStxBalance } from '@app/common/hooks/balance/stx/use-stx-balance';
import { ftDecimals } from '@app/common/stacks-utils';
import { useWalletType } from '@app/common/use-wallet-type';
import { Brc20TokensLoader } from '@app/components/brc20-tokens-loader';
import { CryptoCurrencyAssetItem } from '@app/components/crypto-assets/crypto-currency-asset/crypto-currency-asset-item';
import { StxAvatar } from '@app/components/crypto-assets/stacks/components/stx-avatar';
import { BtcIcon } from '@app/components/icons/btc-icon';
import { CurrentStacksAccountLoader } from '@app/components/stacks-account-loader';
import { Caption } from '@app/components/typography';
import { useStacksFungibleTokenAssetBalancesAnchoredWithMetadata } from '@app/query/stacks/balance/stacks-ft-balances.hooks';
import { useCurrentAccountNativeSegwitAddressIndexZero } from '@app/store/accounts/blockchain/bitcoin/native-segwit-account.hooks';
import { StacksAccount } from '@app/store/accounts/blockchain/stacks/stacks-account.models';

import { Collectibles } from '../collectibles/collectibles';
import { PendingBrc20TransferList } from '../pending-brc-20-transfers/pending-brc-20-transfers';
import { BitcoinFungibleTokenAssetList } from './components/bitcoin-fungible-tokens-asset-list';
import { StacksFungibleTokenAssetList } from './components/stacks-fungible-token-asset-list';

interface StacksBalanceViewerProps {
  account: StacksAccount;
}

export function StacksBalanceViewer({ account }: StacksBalanceViewerProps) {
  const stacksFtAssetBalances = useStacksFungibleTokenAssetBalancesAnchoredWithMetadata(
    account.address
  );

  const { stxEffectiveBalance, stxEffectiveUsdBalance, stxLockedBalance, stxUsdLockedBalance } =
    useStxBalance();

  const stxAdditionalBalanceInfo = stxLockedBalance?.amount.isGreaterThan(0) ? (
    <Text>({ftDecimals(stxLockedBalance.amount, stxLockedBalance.decimals || 0)} locked)</Text>
  ) : undefined;

  const stxAdditionalUsdBalanceInfo = stxLockedBalance?.amount.isGreaterThan(0) ? (
    <Caption ml="4px">({stxUsdLockedBalance} locked)</Caption>
  ) : undefined;

  return (
    <>
      <CryptoCurrencyAssetItem
        assetBalance={stxEffectiveBalance}
        usdBalance={stxEffectiveUsdBalance}
        address={account.address}
        additionalBalanceInfo={stxAdditionalBalanceInfo}
        additionalUsdBalanceInfo={stxAdditionalUsdBalanceInfo}
        icon={<StxAvatar />}
      />
      <StacksFungibleTokenAssetList assetBalances={stacksFtAssetBalances} />
    </>
  );
}

export function BalancesList() {
  const btcAddress = useCurrentAccountNativeSegwitAddressIndexZero();

  const { btcAvailableAssetBalance, btcAvailableUsdBalance } = useBtcAssetBalance(btcAddress);
  const { whenWallet } = useWalletType();
  const navigate = useNavigate();

  return (
    <Stack pb="extra-loose" spacing="loose" data-testid={HomePageSelectorsLegacy.BalancesList}>
      {/* Temporary duplication during Ledger Bitcoin feature dev */}
      {whenWallet({
        software: (
          <CryptoCurrencyAssetItem
            assetBalance={btcAvailableAssetBalance}
            usdBalance={btcAvailableUsdBalance}
            icon={<Box as={BtcIcon} />}
            address={btcAddress}
          />
        ),
        ledger: LEDGER_BITCOIN_ENABLED ? (
          <CryptoCurrencyAssetItem
            assetBalance={btcAvailableAssetBalance}
            usdBalance={btcAvailableUsdBalance}
            icon={<Box as={BtcIcon} />}
            address={btcAddress}
            // add conditionally if not bitcoin keys
            isPressable={!btcAddress}
            onClick={!btcAddress ? () => navigate('bitcoin/connect-your-ledger') : undefined}
          />
        ) : null,
      })}

      <CurrentStacksAccountLoader>
        {account => <StacksBalanceViewer account={account} />}
      </CurrentStacksAccountLoader>

      {whenWallet({
        software: (
          <Brc20TokensLoader>
            {brc20Tokens => <BitcoinFungibleTokenAssetList brc20Tokens={brc20Tokens} />}
          </Brc20TokensLoader>
        ),
        ledger: null,
      })}
      <PendingBrc20TransferList />

      <Collectibles />
      <Outlet />
    </Stack>
  );
}
