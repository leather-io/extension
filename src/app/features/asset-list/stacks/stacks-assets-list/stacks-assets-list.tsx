import { type ReactNode } from 'react';

import type { Sip10CryptoAssetFilter } from '@leather.io/query';
import { StxAvatarIcon } from '@leather.io/ui';

import { CryptoAssetItemLayout } from '@app/components/crypto-asset-item/crypto-asset-item.layout';
import { Sip10TokensLoader } from '@app/components/loaders/sip10-tokens-loader';
import { CurrentStacksAccountLoader } from '@app/components/loaders/stacks-account-loader';
import { Stx20TokensLoader } from '@app/components/loaders/stx20-tokens-loader';
import { StxAssetItemBalanceLoader } from '@app/components/loaders/stx-balance-loader';

import { ConnectLedgerAssetItemFallback } from '../../_components/connect-ledger-asset-item-fallback';
import type { AssetListVariant } from '../../asset-list';
import { Sip10TokenAssetList } from '../sip10-token-asset-list/sip10-token-asset-list';
import { Stx20TokenAssetList } from '../stx20-token-asset-list/stx20-token-asset-list';
import { StxCryptoAssetItem } from '../stx-crypo-asset-item/stx-crypto-asset-item';

interface StacksAssetsListProps {
  isReadOnly: boolean;
  variant: AssetListVariant;
  onSelectAsset?(symbol: string, contractId?: string): void;
  renderRightElement?(id: string): ReactNode;
  filter?: Sip10CryptoAssetFilter;
  showBalance?: boolean;
  showStx?: boolean;
  hasTokenSetter?: React.Dispatch<React.SetStateAction<boolean>>;
}

export function StacksAssetsList({
  isReadOnly,
  variant,
  onSelectAsset,
  renderRightElement,
  filter,
  hasTokenSetter,
  showBalance = true,
  showStx = true,
}: StacksAssetsListProps) {
  return (
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
          {showStx && filter != 'unsupported' ? (
            showBalance ? (
              <StxAssetItemBalanceLoader address={account.address}>
                {(balance, isLoading) => (
                  <StxCryptoAssetItem
                    balance={balance}
                    isLoading={isLoading}
                    onSelectAsset={onSelectAsset}
                  />
                )}
              </StxAssetItemBalanceLoader>
            ) : (
              <CryptoAssetItemLayout
                captionLeft="STX"
                key="STX"
                icon={<StxAvatarIcon />}
                onSelectAsset={onSelectAsset}
                titleLeft="Stacks"
                renderRightElement={renderRightElement}
              />
            )
          ) : null}
          <Sip10TokensLoader
            address={account.address}
            filter={filter ?? (variant === 'interactive' ? 'all' : 'supported')}
          >
            {(isLoading, tokens) => (
              <Sip10TokenAssetList
                isLoading={isLoading}
                tokens={tokens}
                onSelectAsset={onSelectAsset}
                showBalance={showBalance}
                renderRightElement={renderRightElement}
                hasTokenSetter={hasTokenSetter}
              />
            )}
          </Sip10TokensLoader>
          {isReadOnly && (
            <Stx20TokensLoader address={account.address} filter={filter ?? 'supported'}>
              {tokens => <Stx20TokenAssetList tokens={tokens} hasTokenSetter={hasTokenSetter} />}
            </Stx20TokensLoader>
          )}
        </>
      )}
    </CurrentStacksAccountLoader>
  );
}
