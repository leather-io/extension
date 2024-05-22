import { Stack } from 'leather-styles/jsx';

import { useWalletType } from '@app/common/use-wallet-type';
import { BitcoinContractEntryPoint } from '@app/components/bitcoin-contract-entry-point/bitcoin-contract-entry-point';
import {
  BitcoinNativeSegwitAccountLoader,
  BitcoinTaprootAccountLoader,
} from '@app/components/loaders/bitcoin-account-loader';
import { Brc20TokensLoader } from '@app/components/loaders/brc20-tokens-loader';
import { BtcBalanceLoader } from '@app/components/loaders/btc-balance-loader';
import { RunesLoader } from '@app/components/loaders/runes-loader';
import { Sip10TokensLoader } from '@app/components/loaders/sip10-tokens-loader';
import { Src20TokensLoader } from '@app/components/loaders/src20-tokens-loader';
import { CurrentStacksAccountLoader } from '@app/components/loaders/stacks-account-loader';
import { Stx20TokensLoader } from '@app/components/loaders/stx20-tokens-loader';
import { StxBalanceLoader } from '@app/components/loaders/stx-balance-loader';
import { Brc20TokenAssetList } from '@app/features/asset-list/bitcoin/brc20-token-asset-list/brc20-token-asset-list';
import { RunesAssetList } from '@app/features/asset-list/bitcoin/runes-asset-list/runes-asset-list';
import { Src20TokenAssetList } from '@app/features/asset-list/bitcoin/src20-token-asset-list/src20-token-asset-list';
import { Stx20TokenAssetList } from '@app/features/asset-list/stacks/stx20-token-asset-list/stx20-token-asset-list';
import { StxCryptoAssetItem } from '@app/features/asset-list/stacks/stx-crypo-asset-item/stx-crypto-asset-item';
import { useCurrentNetwork } from '@app/store/networks/networks.selectors';
import { BtcAvatarIcon } from '@app/ui/components/avatar/btc-avatar-icon';
import { StxAvatarIcon } from '@app/ui/components/avatar/stx-avatar-icon';

import { ConnectLedgerAssetItemFallback } from './_components/connect-ledger-asset-item-fallback';
import { BtcCryptoAssetItem } from './bitcoin/btc-crypto-asset-item/btc-crypto-asset-item';
import { Sip10TokenAssetList } from './stacks/sip10-token-asset-list/sip10-token-asset-list';
import { Sip10TokenAssetListUnsupported } from './stacks/sip10-token-asset-list/sip10-token-asset-list-unsupported';

export type AssetListVariant = 'interactive' | 'read-only';

interface AssetListProps {
  onSelectAsset?(symbol: string, contractId?: string): void;
  variant?: AssetListVariant;
}
export function AssetList({ onSelectAsset, variant = 'read-only' }: AssetListProps) {
  const network = useCurrentNetwork();
  const { whenWallet } = useWalletType();

  const isReadOnly = variant === 'read-only';

  return (
    <Stack>
      <BitcoinNativeSegwitAccountLoader
        current
        fallback={
          <ConnectLedgerAssetItemFallback
            chain="bitcoin"
            icon={<BtcAvatarIcon />}
            symbol="BTC"
            variant={variant}
          />
        }
      >
        {nativeSegwitAccount => (
          <BtcBalanceLoader address={nativeSegwitAccount.address}>
            {(balance, isInitialLoading) => (
              <BtcCryptoAssetItem
                balance={balance}
                isLoading={isInitialLoading}
                onSelectAsset={onSelectAsset}
              />
            )}
          </BtcBalanceLoader>
        )}
      </BitcoinNativeSegwitAccountLoader>

      {/* Temporary duplication during Ledger Bitcoin feature dev */}
      {isReadOnly &&
        ['testnet', 'regtest'].includes(network.chain.bitcoin.bitcoinNetwork) &&
        whenWallet({
          software: <BitcoinContractEntryPoint />,
          ledger: null,
        })}

      <CurrentStacksAccountLoader
        fallback={
          <ConnectLedgerAssetItemFallback
            chain="stacks"
            icon={<StxAvatarIcon />}
            symbol="STX"
            variant={variant}
          />
        }
      >
        {account => (
          <>
            <StxBalanceLoader address={account.address}>
              {(balance, isInitialLoading) => (
                <StxCryptoAssetItem
                  balance={balance}
                  isLoading={isInitialLoading}
                  onSelectAsset={onSelectAsset}
                />
              )}
            </StxBalanceLoader>
            <Sip10TokensLoader
              address={account.address}
              filter={variant === 'interactive' ? 'all' : 'supported'}
            >
              {(isInitialLoading, tokens) => (
                <Sip10TokenAssetList
                  isLoading={isInitialLoading}
                  tokens={tokens}
                  onSelectAsset={onSelectAsset}
                />
              )}
            </Sip10TokensLoader>
            {isReadOnly && (
              <Stx20TokensLoader address={account.address}>
                {tokens => <Stx20TokenAssetList tokens={tokens} />}
              </Stx20TokensLoader>
            )}
          </>
        )}
      </CurrentStacksAccountLoader>

      <BitcoinNativeSegwitAccountLoader current>
        {nativeSegwitAccount => (
          <BitcoinTaprootAccountLoader current>
            {taprootAccount => (
              <>
                {whenWallet({
                  software: (
                    <Brc20TokensLoader>
                      {tokens => <Brc20TokenAssetList tokens={tokens} variant={variant} />}
                    </Brc20TokensLoader>
                  ),
                  ledger: null,
                })}
                {isReadOnly && (
                  <>
                    <Src20TokensLoader address={nativeSegwitAccount.address}>
                      {tokens => <Src20TokenAssetList tokens={tokens} />}
                    </Src20TokensLoader>
                    <RunesLoader addresses={[nativeSegwitAccount.address, taprootAccount.address]}>
                      {runes => <RunesAssetList runes={runes} />}
                    </RunesLoader>
                  </>
                )}
              </>
            )}
          </BitcoinTaprootAccountLoader>
        )}
      </BitcoinNativeSegwitAccountLoader>

      {isReadOnly && (
        <CurrentStacksAccountLoader>
          {account => (
            <Sip10TokensLoader address={account.address} filter="unsupported">
              {(isInitialLoading, tokens) => (
                <Sip10TokenAssetListUnsupported isLoading={isInitialLoading} tokens={tokens} />
              )}
            </Sip10TokensLoader>
          )}
        </CurrentStacksAccountLoader>
      )}
    </Stack>
  );
}
