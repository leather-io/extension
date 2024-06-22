import { type ReactNode, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { CryptoAssetSelectors } from '@tests/selectors/crypto-asset.selectors';
import { Stack } from 'leather-styles/jsx';

import type { Brc20CryptoAssetInfo, CryptoAssetBalance, MarketData } from '@leather.io/models';
import { Brc20AvatarIcon } from '@leather.io/ui';

import { RouteUrls } from '@shared/route-urls';

import { CryptoAssetItemLayout } from '@app/components/crypto-asset-item/crypto-asset-item.layout';
import type { AssetListVariant } from '@app/features/asset-list/asset-list';
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
  showBalance?: boolean;
  hasTokenSetter?: React.Dispatch<React.SetStateAction<boolean>>;
  renderRightElement?(id: string): ReactNode;
}
export function Brc20TokenAssetList({
  tokens,
  variant,
  hasTokenSetter,
  showBalance = true,
  renderRightElement,
}: Brc20TokenAssetListProps) {
  const navigate = useNavigate();
  const { balance, isLoading } = useCurrentBtcCryptoAssetBalanceNativeSegwit();

  useEffect(() => {
    if (hasTokenSetter && tokens.length) hasTokenSetter(true);
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

  if (!tokens.length) return null;
  return (
    <Stack data-testid={CryptoAssetSelectors.CryptoAssetList}>
      {tokens.map(token => (
        <CryptoAssetItemLayout
          availableBalance={showBalance ? token.balance.availableBalance : null}
          captionLeft={token.info.name.toUpperCase()}
          icon={<Brc20AvatarIcon />}
          isLoading={isLoading}
          key={token.info.symbol}
          onSelectAsset={
            hasPositiveBtcBalanceForFees ? () => navigateToBrc20SendForm(token) : undefined
          }
          titleLeft={token.info.symbol}
          renderRightElement={renderRightElement}
        />
      ))}
    </Stack>
  );
}
