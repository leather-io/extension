import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { CryptoAssetSelectors } from '@tests/selectors/crypto-asset.selectors';
import { Stack } from 'leather-styles/jsx';

import type { Brc20CryptoAssetInfo, CryptoAssetBalance, MarketData } from '@leather.io/models';
import { Brc20AvatarIcon } from '@leather.io/ui';

import { RouteUrls } from '@shared/route-urls';

import type { AssetListVariant, RightElementVariant } from '@app/common/asset-list-utils';
import { CryptoAssetItemBalanceLayout } from '@app/components/crypto-asset-item/crypto-asset-item-balance.layout';
import { CryptoAssetItemToggleLayout } from '@app/components/crypto-asset-item/crypto-asset-item-toggle.layout';
import { useCurrentBtcCryptoAssetBalanceNativeSegwit } from '@app/query/bitcoin/balance/btc-balance-native-segwit.hooks';

interface Brc20TokenAssetDetails {
  balance: CryptoAssetBalance;
  holderAddress: string;
  info: Brc20CryptoAssetInfo;
  marketData: MarketData;
}

interface Brc20TokenAssetListProps {
  tokens: Brc20TokenAssetDetails[];
  variant?: AssetListVariant;
  hasTokenSetter?(tokensLength: number): void;
  rightElementVariant: RightElementVariant;
}
export function Brc20TokenAssetList({
  tokens,
  variant,
  hasTokenSetter,
  rightElementVariant,
}: Brc20TokenAssetListProps) {
  const navigate = useNavigate();
  const { balance, isLoading } = useCurrentBtcCryptoAssetBalanceNativeSegwit();

  useEffect(() => {
    if (hasTokenSetter) hasTokenSetter(tokens.length);
  }, [tokens.length, hasTokenSetter]);

  if (!tokens.length) return null;

  const hasPositiveBtcBalanceForFees =
    variant === 'interactive' && balance.availableBalance.amount.isGreaterThan(0);

  function navigateToBrc20SendForm(token: Brc20TokenAssetDetails) {
    const { balance, holderAddress, info, marketData } = token;
    navigate(RouteUrls.SendBrc20SendForm.replace(':ticker', info.symbol), {
      state: {
        balance: balance.availableBalance,
        holderAddress,
        marketData,
        ticker: info.symbol,
      },
    });
  }

  return (
    <Stack data-testid={CryptoAssetSelectors.CryptoAssetList}>
      {tokens.map(token => {
        const captionLeft = token.info.name.toUpperCase();
        const symbol = token.info.symbol;
        if (rightElementVariant === 'toggle') {
          return (
            <CryptoAssetItemToggleLayout
              captionLeft={captionLeft}
              titleLeft={symbol}
              key={`${symbol}`}
              icon={<Brc20AvatarIcon />}
            />
          );
        }

        return (
          <CryptoAssetItemBalanceLayout
            availableBalance={token.balance.availableBalance}
            captionLeft={captionLeft}
            icon={<Brc20AvatarIcon />}
            isLoading={isLoading}
            key={symbol}
            onSelectAsset={
              hasPositiveBtcBalanceForFees ? () => navigateToBrc20SendForm(token) : undefined
            }
            titleLeft={symbol}
          />
        );
      })}
    </Stack>
  );
}
