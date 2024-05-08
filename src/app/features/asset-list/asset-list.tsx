import { Outlet } from 'react-router-dom';

import { HomePageSelectors } from '@tests/selectors/home.selectors';
import { Stack } from 'leather-styles/jsx';

import { useWalletType } from '@app/common/use-wallet-type';
import {
  BitcoinNativeSegwitAccountLoader,
  BitcoinTaprootAccountLoader,
} from '@app/components/account/bitcoin-account-loader';
import { BitcoinContractEntryPoint } from '@app/components/bitcoin-contract-entry-point/bitcoin-contract-entry-point';
import { Brc20TokenAssetList } from '@app/components/crypto-assets/bitcoin/brc20-token-asset-list/brc20-token-asset-list';
import { RunesAssetList } from '@app/components/crypto-assets/bitcoin/runes-asset-list/runes-asset-list';
import { Src20TokenAssetList } from '@app/components/crypto-assets/bitcoin/src20-token-asset-list/src20-token-asset-list';
import { Stx20TokenAssetList } from '@app/components/crypto-assets/stacks/stx20-token-asset-list/stx20-token-asset-list';
import { Brc20TokensLoader } from '@app/components/loaders/brc20-tokens-loader';
import { BtcBalanceLoader } from '@app/components/loaders/btc-balance-loader';
import { RunesLoader } from '@app/components/loaders/runes-loader';
import { Src20TokensLoader } from '@app/components/loaders/src20-tokens-loader';
import { CurrentStacksAccountLoader } from '@app/components/loaders/stacks-account-loader';
import { Stx20TokensLoader } from '@app/components/loaders/stx20-tokens-loader';
import { useHasBitcoinLedgerKeychain } from '@app/store/accounts/blockchain/bitcoin/bitcoin.ledger';
import { useCurrentNetwork } from '@app/store/networks/networks.selectors';

import { Collectibles } from '../collectibles/collectibles';
import { PendingBrc20TransferList } from '../pending-brc-20-transfers/pending-brc-20-transfers';
import { AddStacksLedgerKeysItem } from './components/add-stacks-ledger-keys-item';
import { BtcBalanceListItem } from './components/btc-balance-list-item';
import { ConnectLedgerAssetBtn } from './components/connect-ledger-asset-button';
import { StacksBalanceListItem } from './components/stacks-balance-list-item';
import { StacksFungibleTokenAssetList } from './components/stacks-fungible-token-asset-list';
import { StacksUnsupportedTokenAssetList } from './components/stacks-unsupported-token-asset-list';

export function AssetsList() {
  const hasBitcoinLedgerKeys = useHasBitcoinLedgerKeychain();
  const network = useCurrentNetwork();
  const { whenWallet } = useWalletType();

  return (
    <Stack data-testid={HomePageSelectors.BalancesList}>
      {whenWallet({
        software: (
          <BitcoinNativeSegwitAccountLoader current>
            {nativeSegwitAccount => (
              <BtcBalanceLoader address={nativeSegwitAccount.address}>
                {(balance, isInitialLoading) => (
                  <BtcBalanceListItem
                    address={nativeSegwitAccount.address}
                    balance={balance}
                    isLoading={isInitialLoading}
                  />
                )}
              </BtcBalanceLoader>
            )}
          </BitcoinNativeSegwitAccountLoader>
        ),
        ledger: (
          <BitcoinNativeSegwitAccountLoader current>
            {nativeSegwitAccount => (
              <BtcBalanceLoader address={nativeSegwitAccount.address}>
                {(balance, isInitialLoading) => (
                  <BtcBalanceListItem
                    address={nativeSegwitAccount.address}
                    balance={balance}
                    isLoading={isInitialLoading}
                    rightElement={
                      hasBitcoinLedgerKeys ? undefined : <ConnectLedgerAssetBtn chain="bitcoin" />
                    }
                  />
                )}
              </BtcBalanceLoader>
            )}
          </BitcoinNativeSegwitAccountLoader>
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
            <Stx20TokensLoader address={account.address}>
              {tokens => <Stx20TokenAssetList tokens={tokens} />}
            </Stx20TokensLoader>
          </>
        )}
      </CurrentStacksAccountLoader>

      <BitcoinNativeSegwitAccountLoader current>
        {nativeSegwitAccount => (
          <BitcoinTaprootAccountLoader current>
            {taprootAccount => (
              <>
                <Brc20TokensLoader>
                  {tokens => <Brc20TokenAssetList tokens={tokens} />}
                </Brc20TokensLoader>
                <Src20TokensLoader address={nativeSegwitAccount.address}>
                  {tokens => <Src20TokenAssetList tokens={tokens} />}
                </Src20TokensLoader>
                <RunesLoader addresses={[nativeSegwitAccount.address, taprootAccount.address]}>
                  {runes => <RunesAssetList runes={runes} />}
                </RunesLoader>
              </>
            )}
          </BitcoinTaprootAccountLoader>
        )}
      </BitcoinNativeSegwitAccountLoader>

      <CurrentStacksAccountLoader>
        {account => <StacksUnsupportedTokenAssetList address={account.address} />}
      </CurrentStacksAccountLoader>
      <PendingBrc20TransferList />

      <Collectibles />

      <Outlet />
    </Stack>
  );
}
