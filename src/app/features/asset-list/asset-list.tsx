import { Outlet } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

import { HomePageSelectorsLegacy } from '@tests-legacy/page-objects/home.selectors';
import { Stack } from 'leather-styles/jsx';

import { LEDGER_BITCOIN_ENABLED } from '@shared/environment';

import { useBtcAssetBalance } from '@app/common/hooks/balance/btc/use-btc-balance';
import { useWalletType } from '@app/common/use-wallet-type';
import { Brc20TokensLoader } from '@app/components/brc20-tokens-loader';
import { CryptoCurrencyAssetItem } from '@app/components/crypto-assets/crypto-currency-asset/crypto-currency-asset-item';
import { BtcIcon } from '@app/components/icons/btc-icon';
import { CurrentStacksAccountLoader } from '@app/components/stacks-account-loader';
import { useCurrentAccountNativeSegwitAddressIndexZero } from '@app/store/accounts/blockchain/bitcoin/native-segwit-account.hooks';

import { Collectibles } from '../collectibles/collectibles';
import { PendingBrc20TransferList } from '../pending-brc-20-transfers/pending-brc-20-transfers';
import { BitcoinFungibleTokenAssetList } from './components/bitcoin-fungible-tokens-asset-list';
import { StacksBalanceItem } from './components/stacks-balance-item';

export function AssetsList() {
  const btcAddress = useCurrentAccountNativeSegwitAddressIndexZero();

  const { btcAvailableAssetBalance, btcAvailableUsdBalance } = useBtcAssetBalance(btcAddress);
  const { whenWallet } = useWalletType();
  const navigate = useNavigate();

  return (
    <Stack pb="space.06" gap="space.05" data-testid={HomePageSelectorsLegacy.BalancesList}>
      {/* Temporary duplication during Ledger Bitcoin feature dev */}
      {whenWallet({
        software: (
          <CryptoCurrencyAssetItem
            assetBalance={btcAvailableAssetBalance}
            usdBalance={btcAvailableUsdBalance}
            icon={<BtcIcon />}
            address={btcAddress}
          />
        ),
        ledger: LEDGER_BITCOIN_ENABLED ? (
          <CryptoCurrencyAssetItem
            assetBalance={btcAvailableAssetBalance}
            usdBalance={btcAvailableUsdBalance}
            icon={<BtcIcon />}
            address={btcAddress}
            // add conditionally if not bitcoin keys
            isPressable={!btcAddress}
            onClick={!btcAddress ? () => navigate('bitcoin/connect-your-ledger') : undefined}
          />
        ) : null,
      })}

      <CurrentStacksAccountLoader>
        {account => <StacksBalanceItem account={account} />}
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
