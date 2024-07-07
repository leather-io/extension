import type { AssetListVariant, RightElementVariant } from '@app/common/asset-list-utils';
import type { AssetFilter } from '@app/common/filter-tokens';
import { useWalletType } from '@app/common/use-wallet-type';
import {
  BitcoinNativeSegwitAccountLoader,
  BitcoinTaprootAccountLoader,
} from '@app/components/loaders/bitcoin-account-loader';
import { Brc20TokensLoader } from '@app/components/loaders/brc20-tokens-loader';
import { RunesLoader } from '@app/components/loaders/runes-loader';
import { Src20TokensLoader } from '@app/components/loaders/src20-tokens-loader';
import { useCurrentAccountIndex } from '@app/store/accounts/account';
import { useAllTokens } from '@app/store/manage-tokens/manage-tokens.slice';

import { Brc20TokenAssetList } from '../brc20-token-asset-list/brc20-token-asset-list';
import { RunesAssetList } from '../runes-asset-list/runes-asset-list';
import { Src20TokenAssetList } from '../src20-token-asset-list/src20-token-asset-list';

interface BitcoinStandardsListProps {
  variant?: AssetListVariant;
  filter?: AssetFilter;
  rightElementVariant: RightElementVariant;
  hasTokenSetter?(tokensLength: number): void;
}

export function BitcoinStandardsList({
  variant,
  hasTokenSetter,
  rightElementVariant,
  filter = 'all',
}: BitcoinStandardsListProps) {
  const { whenWallet } = useWalletType();
  const accountIndex = useCurrentAccountIndex();
  const userSetTokens = useAllTokens();

  const isReadOnly = variant === 'read-only';
  return (
    <BitcoinNativeSegwitAccountLoader current>
      {nativeSegwitAccount => (
        <BitcoinTaprootAccountLoader current>
          {taprootAccount => (
            <>
              {whenWallet({
                software: (
                  <Brc20TokensLoader
                    filter={filter}
                    accountIndex={accountIndex}
                    userSetTokens={userSetTokens}
                  >
                    {tokens => (
                      <Brc20TokenAssetList
                        tokens={tokens}
                        variant={variant}
                        rightElementVariant={rightElementVariant}
                        hasTokenSetter={hasTokenSetter}
                      />
                    )}
                  </Brc20TokensLoader>
                ),
                ledger: null,
              })}
              {isReadOnly && (
                <>
                  <Src20TokensLoader
                    filter={filter}
                    address={nativeSegwitAccount.address}
                    accountIndex={accountIndex}
                    userSetTokens={userSetTokens}
                  >
                    {tokens => (
                      <Src20TokenAssetList
                        tokens={tokens}
                        rightElementVariant={rightElementVariant}
                        hasTokenSetter={hasTokenSetter}
                      />
                    )}
                  </Src20TokensLoader>
                  <RunesLoader
                    filter={filter}
                    addresses={[nativeSegwitAccount.address, taprootAccount.address]}
                    accountIndex={accountIndex}
                    userSetTokens={userSetTokens}
                  >
                    {runes => (
                      <RunesAssetList
                        runes={runes}
                        rightElementVariant={rightElementVariant}
                        hasRunesSetter={hasTokenSetter}
                      />
                    )}
                  </RunesLoader>
                </>
              )}
            </>
          )}
        </BitcoinTaprootAccountLoader>
      )}
    </BitcoinNativeSegwitAccountLoader>
  );
}
