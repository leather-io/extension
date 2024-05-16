import type { CryptoAssetBalance, MarketData } from '@leather-wallet/models';
import { Stack } from 'leather-styles/jsx';

import { useWalletType } from '@app/common/use-wallet-type';
import { BitcoinContractEntryPoint } from '@app/components/bitcoin-contract-entry-point/bitcoin-contract-entry-point';
import {
  BitcoinNativeSegwitAccountLoader,
  BitcoinTaprootAccountLoader,
} from '@app/components/loaders/bitcoin-account-loader';
import { Brc20TokensLoader } from '@app/components/loaders/brc20-tokens-loader';
import { BtcCryptoAssetLoader } from '@app/components/loaders/btc-crypto-asset-loader';
import { RunesLoader } from '@app/components/loaders/runes-loader';
import { Sip10TokensLoader } from '@app/components/loaders/sip10-tokens-loader';
import { Src20TokensLoader } from '@app/components/loaders/src20-tokens-loader';
import { CurrentStacksAccountLoader } from '@app/components/loaders/stacks-account-loader';
import { Stx20TokensLoader } from '@app/components/loaders/stx20-tokens-loader';
import { StxCryptoAssetLoader } from '@app/components/loaders/stx-crypto-asset-loader';
import { Brc20TokenAssetList } from '@app/features/asset-list/bitcoin/brc20-token-asset-list/brc20-token-asset-list';
import { RunesAssetList } from '@app/features/asset-list/bitcoin/runes-asset-list/runes-asset-list';
import { Src20TokenAssetList } from '@app/features/asset-list/bitcoin/src20-token-asset-list/src20-token-asset-list';
import { Stx20TokenAssetList } from '@app/features/asset-list/stacks/stx20-token-asset-list/stx20-token-asset-list';
import { StxCryptoAssetItem } from '@app/features/asset-list/stacks/stx-crypo-asset-item/stx-crypto-asset-item';
import { StxCryptoAssetItemFallback } from '@app/features/asset-list/stacks/stx-crypo-asset-item/stx-crypto-asset-item-fallback';
import type { CryptoAssetInfo } from '@app/query/common/models';
import { useCurrentNetwork } from '@app/store/networks/networks.selectors';

import { BtcCryptoAssetItem } from './bitcoin/btc-crypto-asset-item/btc-crypto-asset-item';
import { BtcCryptoAssetItemFallback } from './bitcoin/btc-crypto-asset-item/btc-crypto-asset-item-fallback';
import { Sip10TokenAssetList } from './stacks/sip10-token-asset-list/sip10-token-asset-list';
import { Sip10TokenAssetListUnsupported } from './stacks/sip10-token-asset-list/sip10-token-asset-list-unsupported';

export type AssetListVariant = 'interactive' | 'read-only';
export interface AssetItem {
  assetInfo: CryptoAssetInfo;
  balance: CryptoAssetBalance;
  marketData: MarketData;
}

interface AssetListProps {
  onClick?(symbol: string, contractId?: string): void;
  variant?: AssetListVariant;
}
export function AssetList({ onClick, variant = 'read-only' }: AssetListProps) {
  const network = useCurrentNetwork();
  const { whenWallet } = useWalletType();

  const isReadOnly = variant === 'read-only';

  return (
    <Stack>
      {whenWallet({
        software: (
          <BitcoinNativeSegwitAccountLoader current>
            {nativeSegwitAccount => (
              <BtcCryptoAssetLoader address={nativeSegwitAccount.address}>
                {(token, isInitialLoading) => (
                  <BtcCryptoAssetItem
                    isLoading={isInitialLoading}
                    onClick={onClick}
                    token={token}
                  />
                )}
              </BtcCryptoAssetLoader>
            )}
          </BitcoinNativeSegwitAccountLoader>
        ),
        ledger: (
          <BitcoinNativeSegwitAccountLoader
            current
            fallback={<BtcCryptoAssetItemFallback variant={variant} />}
          >
            {nativeSegwitAccount => (
              <BtcCryptoAssetLoader address={nativeSegwitAccount.address}>
                {(token, isInitialLoading) => (
                  <BtcCryptoAssetItem
                    isLoading={isInitialLoading}
                    onClick={onClick}
                    token={token}
                  />
                )}
              </BtcCryptoAssetLoader>
            )}
          </BitcoinNativeSegwitAccountLoader>
        ),
      })}

      {/* Temporary duplication during Ledger Bitcoin feature dev */}
      {isReadOnly &&
        ['testnet', 'regtest'].includes(network.chain.bitcoin.bitcoinNetwork) &&
        whenWallet({
          software: <BitcoinContractEntryPoint />,
          ledger: null,
        })}

      <CurrentStacksAccountLoader fallback={<StxCryptoAssetItemFallback variant={variant} />}>
        {account => (
          <>
            <StxCryptoAssetLoader address={account.address}>
              {(token, isInitialLoading) => (
                <StxCryptoAssetItem isLoading={isInitialLoading} onClick={onClick} token={token} />
              )}
            </StxCryptoAssetLoader>
            <Sip10TokensLoader
              address={account.address}
              filter={variant === 'interactive' ? 'all' : 'supported'}
            >
              {tokens => <Sip10TokenAssetList tokens={tokens} onClick={onClick} />}
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
                <Brc20TokensLoader>
                  {tokens => <Brc20TokenAssetList tokens={tokens} variant={variant} />}
                </Brc20TokensLoader>
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
              {tokens => <Sip10TokenAssetListUnsupported tokens={tokens} />}
            </Sip10TokensLoader>
          )}
        </CurrentStacksAccountLoader>
      )}
    </Stack>
  );
}
