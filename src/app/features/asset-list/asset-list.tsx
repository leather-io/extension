import { Dispatch, SetStateAction } from 'react';

import { Stack } from 'leather-styles/jsx';

import { BtcAvatarIcon, StxAvatarIcon } from '@leather.io/ui';

import { Brc20TokensLoader } from '@app/components/loaders/brc20-tokens-loader';
import { BtcAssetItemBalanceLoader } from '@app/components/loaders/btc-balance-loader';
import { Src20TokensLoader } from '@app/components/loaders/src20-tokens-loader';
import { Stx20TokensLoader } from '@app/components/loaders/stx20-tokens-loader';
import { StxAssetItemBalanceLoader } from '@app/components/loaders/stx-balance-loader';
import { Brc20TokenAssetList } from '@app/features/asset-list/bitcoin/brc20-token-asset-list/brc20-token-asset-list';
import { RunesAssetList } from '@app/features/asset-list/bitcoin/runes-asset-list/runes-asset-list';
import { Src20TokenAssetList } from '@app/features/asset-list/bitcoin/src20-token-asset-list/src20-token-asset-list';
import { Stx20TokenAssetList } from '@app/features/asset-list/stacks/stx20-token-asset-list/stx20-token-asset-list';
import { StxCryptoAssetItem } from '@app/features/asset-list/stacks/stx-crypo-asset-item/stx-crypto-asset-item';
import { useCurrentAccountIndex } from '@app/store/accounts/account';
import { useCurrentAccountNativeSegwitSigner } from '@app/store/accounts/blockchain/bitcoin/native-segwit-account.hooks';
import { useCurrentAccountTaprootSigner } from '@app/store/accounts/blockchain/bitcoin/taproot-account.hooks';
import { useCurrentStacksAccount } from '@app/store/accounts/blockchain/stacks/stacks-account.hooks';
import { useHasLedgerKeys } from '@app/store/ledger/ledger.selectors';
import { useIsPrivateMode } from '@app/store/settings/settings.selectors';

import type { AssetFilter } from '../../common/hooks/use-manage-tokens';
import { ConnectLedgerAssetItemFallback } from './_components/connect-ledger-asset-item-fallback';
import { BtcCryptoAssetItem } from './bitcoin/btc-crypto-asset-item/btc-crypto-asset-item';
import { Sip10TokenAssetList } from './stacks/sip10-token-asset-list/sip10-token-asset-list';

export type AssetListVariant = 'interactive' | 'read-only';
export type AssetRightElementVariant = 'balance' | 'toggle';

interface AssetListProps {
  filter?: AssetFilter;
  variant?: AssetListVariant;
  assetRightElementVariant?: AssetRightElementVariant;
  showUnmanageableTokens?: boolean;
  onSelectAsset?(symbol: string, contractId?: string): void;
  setHasManageableTokens?: Dispatch<SetStateAction<boolean>>;
}

export function AssetList({
  onSelectAsset,
  variant = 'read-only',
  assetRightElementVariant = 'balance',
  showUnmanageableTokens = true,
  setHasManageableTokens,
  filter,
}: AssetListProps) {
  const currentAccountIndex = useCurrentAccountIndex();
  const currentStacksAccount = useCurrentStacksAccount();
  const currentBtcNativeSegwitAccount = useCurrentAccountNativeSegwitSigner();
  const currentBtcTaprootAccount = useCurrentAccountTaprootSigner();
  const isLedger = useHasLedgerKeys();
  const isPrivate = useIsPrivateMode();

  const isReadOnly = variant === 'read-only';

  return (
    <Stack>
      {showUnmanageableTokens &&
        (currentBtcNativeSegwitAccount ? (
          <BtcAssetItemBalanceLoader accountIndex={currentAccountIndex}>
            {(balance, isLoading, isLoadingAdditionalData) => (
              <BtcCryptoAssetItem
                balance={balance}
                isLoading={isLoading}
                onSelectAsset={onSelectAsset}
                isLoadingAdditionalData={isLoadingAdditionalData}
              />
            )}
          </BtcAssetItemBalanceLoader>
        ) : (
          isLedger && (
            <ConnectLedgerAssetItemFallback
              chain="bitcoin"
              icon={<BtcAvatarIcon />}
              symbol="BTC"
              variant={variant}
            />
          )
        ))}

      {showUnmanageableTokens &&
        (currentStacksAccount ? (
          <StxAssetItemBalanceLoader accountIndex={currentAccountIndex}>
            {(balance, isLoading) => (
              <StxCryptoAssetItem
                balance={balance}
                isLoading={isLoading}
                isPrivate={isPrivate}
                onSelectAsset={onSelectAsset}
              />
            )}
          </StxAssetItemBalanceLoader>
        ) : (
          isLedger && (
            <ConnectLedgerAssetItemFallback
              chain="stacks"
              icon={<StxAvatarIcon />}
              symbol="STX"
              variant={variant}
            />
          )
        ))}

      {currentStacksAccount && (
        <>
          <Sip10TokenAssetList
            accountIndex={currentAccountIndex}
            assetFilter={filter}
            onSelectAsset={onSelectAsset}
            assetRightElementVariant={assetRightElementVariant}
            setHasManageableTokens={setHasManageableTokens}
          />
          {isReadOnly && (
            <Stx20TokensLoader address={currentStacksAccount.address} filter={filter}>
              {({ tokens, preEnabledTokensIds }) => (
                <Stx20TokenAssetList
                  tokens={tokens}
                  assetRightElementVariant={assetRightElementVariant}
                  preEnabledTokensIds={preEnabledTokensIds}
                  setHasManageableTokens={setHasManageableTokens}
                />
              )}
            </Stx20TokensLoader>
          )}
        </>
      )}

      {currentBtcTaprootAccount && currentBtcNativeSegwitAccount && isReadOnly && (
        <>
          <Brc20TokensLoader filter={filter}>
            {({ tokens, preEnabledTokensIds }) => (
              <Brc20TokenAssetList
                tokens={tokens}
                variant={variant}
                assetRightElementVariant={assetRightElementVariant}
                preEnabledTokensIds={preEnabledTokensIds}
                setHasManageableTokens={setHasManageableTokens}
              />
            )}
          </Brc20TokensLoader>
          <Src20TokensLoader filter={filter} address={currentBtcNativeSegwitAccount(0).address}>
            {({ tokens, preEnabledTokensIds }) => (
              <Src20TokenAssetList
                tokens={tokens}
                assetRightElementVariant={assetRightElementVariant}
                preEnabledTokensIds={preEnabledTokensIds}
                setHasManageableTokens={setHasManageableTokens}
              />
            )}
          </Src20TokensLoader>
          <RunesAssetList
            accountIndex={currentAccountIndex}
            filter={filter}
            assetRightElementVariant={assetRightElementVariant}
            setHasManageableTokens={setHasManageableTokens}
          />
        </>
      )}
    </Stack>
  );
}
