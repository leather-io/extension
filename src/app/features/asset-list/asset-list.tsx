import { Stack } from 'leather-styles/jsx';

import { BtcAvatarIcon, StxAvatarIcon } from '@leather.io/ui';

import { useWalletType } from '@app/common/use-wallet-type';
import {
  BitcoinNativeSegwitAccountLoader,
  BitcoinTaprootAccountLoader,
} from '@app/components/loaders/bitcoin-account-loader';
import { Brc20TokensLoader } from '@app/components/loaders/brc20-tokens-loader';
import { BtcAssetItemBalanceLoader } from '@app/components/loaders/btc-balance-loader';
import { RunesLoader } from '@app/components/loaders/runes-loader';
import { Sip10TokensLoader } from '@app/components/loaders/sip10-tokens-loader';
import { Src20TokensLoader } from '@app/components/loaders/src20-tokens-loader';
import { CurrentStacksAccountLoader } from '@app/components/loaders/stacks-account-loader';
import { Stx20TokensLoader } from '@app/components/loaders/stx20-tokens-loader';
import { StxAssetItemBalanceLoader } from '@app/components/loaders/stx-balance-loader';
import { Brc20TokenAssetList } from '@app/features/asset-list/bitcoin/brc20-token-asset-list/brc20-token-asset-list';
import { RunesAssetList } from '@app/features/asset-list/bitcoin/runes-asset-list/runes-asset-list';
import { Src20TokenAssetList } from '@app/features/asset-list/bitcoin/src20-token-asset-list/src20-token-asset-list';
import { Stx20TokenAssetList } from '@app/features/asset-list/stacks/stx20-token-asset-list/stx20-token-asset-list';
import { StxCryptoAssetItem } from '@app/features/asset-list/stacks/stx-crypo-asset-item/stx-crypto-asset-item';
import { useCurrentStacksAccount } from '@app/store/accounts/blockchain/stacks/stacks-account.hooks';
import { useHasLedgerKeys } from '@app/store/ledger/ledger.selectors';

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
  const { whenWallet } = useWalletType();
  const currentAccount = useCurrentStacksAccount();
  const isLedger = useHasLedgerKeys();

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
          <BtcAssetItemBalanceLoader address={nativeSegwitAccount.address}>
            {(balance, isLoading) => (
              <BtcCryptoAssetItem
                balance={balance}
                isLoading={isLoading}
                onSelectAsset={onSelectAsset}
              />
            )}
          </BtcAssetItemBalanceLoader>
        )}
      </BitcoinNativeSegwitAccountLoader>

      <CurrentStacksAccountLoader
        fallback={
          !currentAccount && !isLedger ? null : (
            <ConnectLedgerAssetItemFallback
              chain="stacks"
              icon={<StxAvatarIcon />}
              symbol="STX"
              variant={variant}
            />
          )
        }
      >
        {account => (
          <>
            <StxAssetItemBalanceLoader address={account.address}>
              {(balance, isLoading) => (
                <StxCryptoAssetItem
                  balance={balance}
                  isLoading={isLoading}
                  onSelectAsset={onSelectAsset}
                />
              )}
            </StxAssetItemBalanceLoader>
            <Sip10TokensLoader
              address={account.address}
              filter={variant === 'interactive' ? 'all' : 'supported'}
            >
              {(isLoading, tokens) => (
                <Sip10TokenAssetList
                  isLoading={isLoading}
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
              {(isLoading, tokens) => (
                <Sip10TokenAssetListUnsupported isLoading={isLoading} tokens={tokens} />
              )}
            </Sip10TokensLoader>
          )}
        </CurrentStacksAccountLoader>
      )}
    </Stack>
  );
}
