import { useNavigate } from 'react-router-dom';

import { CryptoAssetSelectors } from '@tests/selectors/crypto-asset.selectors';
import { Stack } from 'leather-styles/jsx';

import { RouteUrls } from '@shared/route-urls';
import { noop } from '@shared/utils';

import { useNativeSegwitBalance } from '@app/query/bitcoin/balance/btc-native-segwit-balance.hooks';
import { Brc20Token } from '@app/query/bitcoin/bitcoin-client';
import { useCurrentAccountNativeSegwitAddressIndexZero } from '@app/store/accounts/blockchain/bitcoin/native-segwit-account.hooks';

import { Brc20TokenAssetItemLayout } from './components/brc20-token-asset-item.layout';

export function Brc20TokenAssetList(props: { brc20Tokens?: Brc20Token[] }) {
  const navigate = useNavigate();
  const currentAccountBtcAddress = useCurrentAccountNativeSegwitAddressIndexZero();
  const { btcBalance: btcCryptoCurrencyAssetBalance } =
    useNativeSegwitBalance(currentAccountBtcAddress);

  const hasPositiveBtcBalanceForFees =
    btcCryptoCurrencyAssetBalance.balance.amount.isGreaterThan(0);

  function navigateToBrc20SendForm(token: Brc20Token) {
    const { ticker, available_balance, decimals, holderAddress } = token;
    navigate(RouteUrls.SendBrc20SendForm.replace(':ticker', ticker), {
      state: { balance: available_balance, ticker, decimals, holderAddress },
    });
  }

  if (!props.brc20Tokens?.length) return null;

  return (
    <Stack data-testid={CryptoAssetSelectors.CryptoAssetList}>
      {props.brc20Tokens?.map(token => (
        <Brc20TokenAssetItemLayout
          key={token.ticker}
          token={token}
          onClick={hasPositiveBtcBalanceForFees ? () => navigateToBrc20SendForm(token) : noop}
        />
      ))}
    </Stack>
  );
}
