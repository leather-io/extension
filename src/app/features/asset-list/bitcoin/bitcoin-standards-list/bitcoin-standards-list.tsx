import { type ReactNode } from 'react';

import { useWalletType } from '@app/common/use-wallet-type';
import {
  BitcoinNativeSegwitAccountLoader,
  BitcoinTaprootAccountLoader,
} from '@app/components/loaders/bitcoin-account-loader';
import { Brc20TokensLoader } from '@app/components/loaders/brc20-tokens-loader';
import { RunesLoader } from '@app/components/loaders/runes-loader';
import { Src20TokensLoader } from '@app/components/loaders/src20-tokens-loader';

import type { AssetListVariant } from '../../asset-list';
import { Brc20TokenAssetList } from '../brc20-token-asset-list/brc20-token-asset-list';
import { RunesAssetList } from '../runes-asset-list/runes-asset-list';
import { Src20TokenAssetList } from '../src20-token-asset-list/src20-token-asset-list';
import type { AssetFilter } from '@app/common/filter-tokens';

interface BitcoinStandardsListProps {
  isReadOnly: boolean;
  variant?: AssetListVariant;
  showBalance?: boolean;
  renderRightElement?(id: string): ReactNode;
  filter?: AssetFilter;
  hasTokenSetter?: React.Dispatch<React.SetStateAction<boolean>>;
}

export function BitcoinStandardsList({
  isReadOnly,
  variant,
  renderRightElement,
  hasTokenSetter,
  showBalance = true,
  filter = 'all',
}: BitcoinStandardsListProps) {
  const { whenWallet } = useWalletType();
  return (
    <>
      <BitcoinNativeSegwitAccountLoader current>
        {nativeSegwitAccount => (
          <BitcoinTaprootAccountLoader current>
            {taprootAccount => (
              <>
                {whenWallet({
                  software: (
                    <Brc20TokensLoader filter={filter}>
                      {tokens => (
                        <Brc20TokenAssetList
                          tokens={tokens}
                          variant={variant}
                          showBalance={showBalance}
                          renderRightElement={renderRightElement}
                          hasTokenSetter={hasTokenSetter}
                        />
                      )}
                    </Brc20TokensLoader>
                  ),
                  ledger: null,
                })}
                {isReadOnly && (
                  <>
                    <Src20TokensLoader filter={filter} address={nativeSegwitAccount.address}>
                      {tokens => (
                        <Src20TokenAssetList
                          tokens={tokens}
                          showBalance={showBalance}
                          renderRightElement={renderRightElement}
                          hasTokenSetter={hasTokenSetter}
                        />
                      )}
                    </Src20TokensLoader>
                    <RunesLoader
                      filter={filter}
                      addresses={[nativeSegwitAccount.address, taprootAccount.address]}
                    >
                      {runes => (
                        <RunesAssetList
                          runes={runes}
                          showBalance={showBalance}
                          renderRightElement={renderRightElement}
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
    </>
  );
}
