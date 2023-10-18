import { Outlet } from 'react-router-dom';

import { HomePageSelectors } from '@tests/selectors/home.selectors';
import { Stack } from 'leather-styles/jsx';

import { LEDGER_BITCOIN_ENABLED } from '@shared/environment';

import { useBtcAssetBalance } from '@app/common/hooks/balance/btc/use-btc-balance';
import { useStxBalance } from '@app/common/hooks/balance/stx/use-stx-balance';
import { useWalletType } from '@app/common/use-wallet-type';
import { Brc20TokensLoader } from '@app/components/brc20-tokens-loader';
import { CryptoCurrencyAssetItem } from '@app/components/crypto-assets/crypto-currency-asset/crypto-currency-asset-item';
import { StxAvatar } from '@app/components/crypto-assets/stacks/components/stx-avatar';
import { BtcIcon } from '@app/components/icons/btc-icon';
import { CurrentStacksAccountLoader } from '@app/components/stacks-account-loader';
import { useHasBitcoinLedgerKeychain } from '@app/store/accounts/blockchain/bitcoin/bitcoin.ledger';
import { useCurrentAccountNativeSegwitAddressIndexZero } from '@app/store/accounts/blockchain/bitcoin/native-segwit-account.hooks';
import { useCurrentStacksAccount } from '@app/store/accounts/blockchain/stacks/stacks-account.hooks';
import { useHasStacksKeychain } from '@app/store/accounts/blockchain/stacks/stacks.hooks';

import { Collectibles } from '../collectibles/collectibles';
import { PendingBrc20TransferList } from '../pending-brc-20-transfers/pending-brc-20-transfers';
import { BitcoinFungibleTokenAssetList } from './components/bitcoin-fungible-tokens-asset-list';
import { ConnectLedgerAssetBtn } from './components/connect-ledger-asset-button';
import { StacksBalanceItem } from './components/stacks-balance-item';

export function AssetsList() {
  const hasStacksKeys = useHasStacksKeychain();
  const hasBitcoinKeys = useHasBitcoinLedgerKeychain();
  const btcAddress = useCurrentAccountNativeSegwitAddressIndexZero();
  const currentAccount = useCurrentStacksAccount();

  const { btcAvailableAssetBalance, btcAvailableUsdBalance } = useBtcAssetBalance(btcAddress);
  const { stxEffectiveBalance, stxEffectiveUsdBalance } = useStxBalance();

  const { whenWallet } = useWalletType();

  return (
    <Stack pb="space.06" gap="space.05" data-testid={HomePageSelectors.BalancesList}>
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
            rightElement={hasBitcoinKeys ? undefined : <ConnectLedgerAssetBtn chain="bitcoin" />}
          />
        ) : null,
      })}

      {whenWallet({
        software: (
          <CurrentStacksAccountLoader>
            {account => <StacksBalanceItem account={account} />}
          </CurrentStacksAccountLoader>
        ),
        ledger: (
          <CryptoCurrencyAssetItem
            assetBalance={stxEffectiveBalance}
            usdBalance={stxEffectiveUsdBalance}
            icon={<StxAvatar />}
            address={currentAccount?.address || ''}
            rightElement={hasStacksKeys ? undefined : <ConnectLedgerAssetBtn chain="stacks" />}
          />
        ),
      })}

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
