import { useNavigate } from 'react-router-dom';

import { CryptoAssetSelectors } from '@tests/selectors/crypto-asset.selectors';
import { Stack } from 'leather-styles/jsx';

import { RouteUrls } from '@shared/route-urls';

import { useCurrentNativeSegwitAvailableBalance } from '@app/query/bitcoin/balance/btc-native-segwit-balance.hooks';
import { Brc20Token } from '@app/query/bitcoin/bitcoin-client';

import { Brc20TokenAssetItemLayout } from './brc20-token-asset-item.layout';

interface Brc20TokenAssetListProps {
  tokens: Brc20Token[];
  variant?: string;
}
export function Brc20TokenAssetList({ tokens, variant }: Brc20TokenAssetListProps) {
  const navigate = useNavigate();
  const { balance } = useCurrentNativeSegwitAvailableBalance();

  const hasPositiveBtcBalanceForFees = variant === 'send' && balance.amount.isGreaterThan(0);

  function navigateToBrc20SendForm(token: Brc20Token) {
    const { balance, holderAddress, marketData, tokenData } = token;
    navigate(RouteUrls.SendBrc20SendForm.replace(':ticker', tokenData.ticker), {
      state: { balance, ticker: tokenData.ticker, holderAddress, marketData },
    });
  }

  return (
    <Stack data-testid={CryptoAssetSelectors.CryptoAssetList}>
      {tokens.map(token => (
        <Brc20TokenAssetItemLayout
          key={token.tokenData.ticker}
          token={token}
          onClick={hasPositiveBtcBalanceForFees ? () => navigateToBrc20SendForm(token) : undefined}
        />
      ))}
    </Stack>
  );
}
