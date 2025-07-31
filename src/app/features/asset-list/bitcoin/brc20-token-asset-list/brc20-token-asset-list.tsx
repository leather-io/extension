import { type Dispatch, type SetStateAction, useEffect } from 'react';

import { CryptoAssetSelectors } from '@tests/selectors/crypto-asset.selectors';
import { Stack } from 'leather-styles/jsx';

import type { Brc20Asset, CryptoAssetBalance, MarketData } from '@leather.io/models';
import { Brc20AvatarIcon } from '@leather.io/ui';
import { getAssetDisplayName } from '@leather.io/utils';

import { convertAssetBalanceToFiat } from '@app/common/asset-utils';
import { useManageTokens } from '@app/common/hooks/use-manage-tokens';
import { CryptoAssetItem } from '@app/components/crypto-asset-item/crypto-asset-item';
import type {
  AssetListVariant,
  AssetRightElementVariant,
} from '@app/features/asset-list/asset-list';
import { useCurrentNativeSegwitBtcBalanceWithFallback } from '@app/query/bitcoin/balance/btc-balance.hooks';
import { useIsPrivateMode } from '@app/store/settings/settings.selectors';

interface Brc20TokenAssetDetails {
  balance: CryptoAssetBalance;
  holderAddress: string;
  info: Brc20Asset;
  marketData: MarketData;
}

interface Brc20TokenAssetListProps {
  tokens: Brc20TokenAssetDetails[];
  variant?: AssetListVariant;
  assetRightElementVariant?: AssetRightElementVariant;
  preEnabledTokensIds: string[];
  setHasManageableTokens?: Dispatch<SetStateAction<boolean>>;
}

function getBrc20TokenFiatBalance(token: Brc20TokenAssetDetails) {
  return convertAssetBalanceToFiat({
    balance: token.balance.availableBalance,
    marketData: token.marketData,
  });
}

export function Brc20TokenAssetList({
  tokens,
  assetRightElementVariant,
  preEnabledTokensIds,
  setHasManageableTokens,
}: Brc20TokenAssetListProps) {
  const { isLoading } = useCurrentNativeSegwitBtcBalanceWithFallback();
  const isPrivate = useIsPrivateMode();
  const { isTokenEnabled } = useManageTokens();

  useEffect(() => {
    if (tokens.length > 0 && setHasManageableTokens) {
      setHasManageableTokens(true);
    }
  }, [tokens, setHasManageableTokens]);

  if (!tokens.length) return null;

  return (
    <Stack data-testid={CryptoAssetSelectors.CryptoAssetList}>
      {tokens.map(token => {
        const key = token.info.symbol;
        const captionLeft = getAssetDisplayName(token.info).toUpperCase();
        const icon = <Brc20AvatarIcon />;
        const titleLeft = token.info.symbol;

        return (
          <CryptoAssetItem
            key={key}
            isToggleMode={assetRightElementVariant === 'toggle'}
            toggleProps={{
              captionLeft,
              icon,
              titleLeft,
              assetId: key,
              isCheckedByDefault: isTokenEnabled({ tokenId: key, preEnabledTokensIds }),
            }}
            itemProps={{
              availableBalance: token.balance.availableBalance,
              captionLeft,
              icon,
              isLoading,
              isPrivate,
              titleLeft,
              fiatBalance: getBrc20TokenFiatBalance(token),
              dataTestId: key,
            }}
          />
        );
      })}
    </Stack>
  );
}
