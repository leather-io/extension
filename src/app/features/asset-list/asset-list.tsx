import { Outlet } from 'react-router-dom';

import { HomePageSelectors } from '@tests/selectors/home.selectors';
import { Stack } from 'leather-styles/jsx';

import { useBtcAssetBalance } from '@app/common/hooks/balance/btc/use-btc-balance';
import { useWalletType } from '@app/common/use-wallet-type';
import {
  BitcoinNativeSegwitAccountLoader,
  BitcoinTaprootAccountLoader,
} from '@app/components/account/bitcoin-account-loader';
import { BitcoinContractEntryPoint } from '@app/components/bitcoin-contract-entry-point/bitcoin-contract-entry-point';
import { CryptoCurrencyAssetItemLayout } from '@app/components/crypto-assets/crypto-currency-asset/crypto-currency-asset-item.layout';
import { CurrentStacksAccountLoader } from '@app/components/loaders/stacks-account-loader';
import { useHasBitcoinLedgerKeychain } from '@app/store/accounts/blockchain/bitcoin/bitcoin.ledger';
import { useCurrentAccountNativeSegwitAddressIndexZero } from '@app/store/accounts/blockchain/bitcoin/native-segwit-account.hooks';
import { useCurrentNetwork } from '@app/store/networks/networks.selectors';
import { BtcAvatarIcon } from '@app/ui/components/avatar/btc-avatar-icon';

import { Collectibles } from '../collectibles/collectibles';
import { PendingBrc20TransferList } from '../pending-brc-20-transfers/pending-brc-20-transfers';
import { AddStacksLedgerKeysItem } from './components/add-stacks-ledger-keys-item';
import { BitcoinFungibleTokenAssetList } from './components/bitcoin-fungible-tokens-asset-list';
import { ConnectLedgerAssetBtn } from './components/connect-ledger-asset-button';
import { StacksBalanceListItem } from './components/stacks-balance-list-item';
import { StacksFungibleTokenAssetList } from './components/stacks-fungible-token-asset-list';

export function AssetsList() {
  const hasBitcoinLedgerKeys = useHasBitcoinLedgerKeychain();
  const bitcoinAddressNativeSegwit = useCurrentAccountNativeSegwitAddressIndexZero();
  const network = useCurrentNetwork();

  const { btcAvailableAssetBalance, btcAvailableUsdBalance, isInitialLoading } = useBtcAssetBalance(
    bitcoinAddressNativeSegwit
  );

  const { whenWallet } = useWalletType();

  return (
    <Stack data-testid={HomePageSelectors.BalancesList}>
      {whenWallet({
        software: (
          <CryptoCurrencyAssetItemLayout
            assetBalance={btcAvailableAssetBalance}
            usdBalance={btcAvailableUsdBalance}
            icon={<BtcAvatarIcon />}
            address={bitcoinAddressNativeSegwit}
            isLoading={isInitialLoading}
          />
        ),
        ledger: (
          <CryptoCurrencyAssetItemLayout
            assetBalance={btcAvailableAssetBalance}
            usdBalance={btcAvailableUsdBalance}
            icon={<BtcAvatarIcon />}
            address={bitcoinAddressNativeSegwit}
            isLoading={isInitialLoading}
            rightElement={
              hasBitcoinLedgerKeys ? undefined : <ConnectLedgerAssetBtn chain="bitcoin" />
            }
          />
        ),
      })}

      {/* Temporary duplication during Ledger Bitcoin feature dev */}
      {['testnet', 'regtest'].includes(network.chain.bitcoin.bitcoinNetwork) &&
        whenWallet({
          software: <BitcoinContractEntryPoint />,
          ledger: null,
        })}

      <CurrentStacksAccountLoader fallback={<AddStacksLedgerKeysItem />}>
        {account => (
          <>
            <StacksBalanceListItem address={account.address} />
            <StacksFungibleTokenAssetList address={account.address} />
          </>
        )}
      </CurrentStacksAccountLoader>

      <BitcoinNativeSegwitAccountLoader current>
        {nativeSegwitAccount => (
          <BitcoinTaprootAccountLoader current>
            {taprootAccount => (
              <BitcoinFungibleTokenAssetList
                btcAddressNativeSegwit={nativeSegwitAccount.address}
                btcAddressTaproot={taprootAccount.address}
              />
            )}
          </BitcoinTaprootAccountLoader>
        )}
      </BitcoinNativeSegwitAccountLoader>

      <PendingBrc20TransferList />

      <Collectibles />

      <Outlet />
    </Stack>
  );
}
