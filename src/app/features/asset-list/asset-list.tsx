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
import type { AccountCryptoAssetWithDetails } from '@app/query/models/crypto-asset.model';
import { useCurrentNetwork } from '@app/store/networks/networks.selectors';

import { BtcCryptoAssetItem } from './bitcoin/btc-crypto-asset-item/btc-crypto-asset-item';
import { BtcCryptoAssetItemFallback } from './bitcoin/btc-crypto-asset-item/btc-crypto-asset-item-fallback';
import { Sip10TokenAssetList } from './stacks/sip10-token-asset-list/sip10-token-asset-list';
import { Sip10TokenAssetListUnsupported } from './stacks/sip10-token-asset-list/sip10-token-asset-list-unsupported';

export type AssetListVariant = 'interactive' | 'read-only';

interface AssetListProps {
  onClick?(asset: AccountCryptoAssetWithDetails): void;
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
                {(asset, isInitialLoading) => (
                  <BtcCryptoAssetItem
                    asset={asset}
                    isLoading={isInitialLoading}
                    onClick={onClick}
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
                {(asset, isInitialLoading) => (
                  <BtcCryptoAssetItem
                    asset={asset}
                    isLoading={isInitialLoading}
                    onClick={onClick}
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
              {(asset, isInitialLoading) => (
                <StxCryptoAssetItem asset={asset} isLoading={isInitialLoading} onClick={onClick} />
              )}
            </StxCryptoAssetLoader>
            <Sip10TokenAssetList address={account.address} onClick={onClick} />
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
                      {tokens => <Brc20TokenAssetList assets={tokens} variant={variant} />}
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
          {account => <Sip10TokenAssetListUnsupported address={account.address} />}
        </CurrentStacksAccountLoader>
      )}
    </Stack>
  );
}
