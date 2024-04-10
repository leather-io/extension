import { useNavigate } from 'react-router-dom';

import { CryptoAssetSelectors } from '@tests/selectors/crypto-asset.selectors';
import { Stack } from 'leather-styles/jsx';

import { RouteUrls } from '@shared/route-urls';

import { useNativeSegwitBalance } from '@app/query/bitcoin/balance/btc-native-segwit-balance.hooks';
import { Brc20Token } from '@app/query/bitcoin/bitcoin-client';
import { useCurrentAccountNativeSegwitAddressIndexZero } from '@app/store/accounts/blockchain/bitcoin/native-segwit-account.hooks';

import { Brc20TokenAssetItemLayout } from './brc20-token-asset-item.layout';

interface Brc20TokenAssetListProps {
  brc20Tokens: Brc20Token[];
  variant?: string;
}
export function Brc20TokenAssetList({ brc20Tokens, variant }: Brc20TokenAssetListProps) {
  const navigate = useNavigate();
  const currentAccountBtcAddress = useCurrentAccountNativeSegwitAddressIndexZero();
  const { btcBalance: btcCryptoCurrencyAssetBalance } =
    useNativeSegwitBalance(currentAccountBtcAddress);

  const hasPositiveBtcBalanceForFees =
    variant === 'send' && btcCryptoCurrencyAssetBalance.balance.amount.isGreaterThan(0);

  function navigateToBrc20SendForm(token: Brc20Token) {
    const { ticker, available_balance, decimals, holderAddress } = token;
    navigate(RouteUrls.SendBrc20SendForm.replace(':ticker', ticker), {
      state: { balance: available_balance, ticker, decimals, holderAddress },
    });
  }

  return (
    <Stack data-testid={CryptoAssetSelectors.CryptoAssetList}>
      {brc20Tokens.map(token => (
        <Brc20TokenAssetItemLayout
          key={token.ticker}
          token={token}
          onClick={hasPositiveBtcBalanceForFees ? () => navigateToBrc20SendForm(token) : undefined}
        />
      ))}
    </Stack>
  );
}
