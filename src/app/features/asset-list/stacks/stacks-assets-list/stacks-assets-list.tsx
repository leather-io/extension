import type { Sip10CryptoAssetFilter } from '@leather.io/query';
import { StxAvatarIcon } from '@leather.io/ui';

import type { AssetListVariant, RightElementVariant } from '@app/common/asset-list-utils';
import { Sip10TokensLoader } from '@app/components/loaders/sip10-tokens-loader';
import { CurrentStacksAccountLoader } from '@app/components/loaders/stacks-account-loader';
import { Stx20TokensLoader } from '@app/components/loaders/stx20-tokens-loader';
import { useCurrentAccountIndex } from '@app/store/accounts/account';
import { useAllTokens } from '@app/store/manage-tokens/manage-tokens.slice';

import { ConnectLedgerAssetItemFallback } from '../../_components/connect-ledger-asset-item-fallback';
import { Sip10TokenAssetList } from '../sip10-token-asset-list/sip10-token-asset-list';
import { Stx20TokenAssetList } from '../stx20-token-asset-list/stx20-token-asset-list';
import { StxCryptoAssetItem } from '../stx-crypto-asset-item/stx-crypto-asset-item';

interface StacksAssetsListProps {
  variant: AssetListVariant;
  onSelectAsset?(symbol: string, contractId?: string): void;
  filter?: Sip10CryptoAssetFilter;
  showStx?: boolean;
  hasTokenSetter?(tokensLength: number): void;
  rightElementVariant: RightElementVariant;
}

export function StacksAssetsList({
  variant,
  onSelectAsset,
  filter,
  hasTokenSetter,
  rightElementVariant,
  showStx = true,
}: StacksAssetsListProps) {
  const accountIndex = useCurrentAccountIndex();
  const userSetTokens = useAllTokens();

  const isReadOnly = variant === 'read-only';
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
          <StxCryptoAssetItem
            showStx={showStx}
            account={account}
            rightElementVariant={rightElementVariant}
            filter={filter}
            onSelectAsset={onSelectAsset}
          />
          <Sip10TokensLoader
            address={account.address}
            filter={filter ?? (variant === 'interactive' ? 'all' : 'supported')}
            accountIndex={accountIndex}
            userSetTokens={userSetTokens}
          >
            {(isLoading, tokens) => (
              <Sip10TokenAssetList
                isLoading={isLoading}
                tokens={tokens}
                onSelectAsset={onSelectAsset}
                rightElementVariant={rightElementVariant}
                hasTokenSetter={hasTokenSetter}
              />
            )}
          </Sip10TokensLoader>
          {isReadOnly && (
            <Stx20TokensLoader
              address={account.address}
              filter={filter ?? 'supported'}
              accountIndex={accountIndex}
              userSetTokens={userSetTokens}
            >
              {tokens => (
                <Stx20TokenAssetList
                  rightElementVariant={rightElementVariant}
                  tokens={tokens}
                  hasTokenSetter={hasTokenSetter}
                />
              )}
            </Stx20TokensLoader>
          )}
        </>
      )}
    </CurrentStacksAccountLoader>
  );
}
