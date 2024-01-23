import { useNavigate } from 'react-router-dom';

import { RouteUrls } from '@shared/route-urls';
import { noop } from '@shared/utils';

import { useNativeSegwitBalance } from '@app/query/bitcoin/balance/btc-native-segwit-balance.hooks';
import { Brc20Token } from '@app/query/bitcoin/ordinals/brc20/brc20-tokens.query';
import { useCurrentAccountNativeSegwitAddressIndexZero } from '@app/store/accounts/blockchain/bitcoin/native-segwit-account.hooks';

import { Brc20TokenAssetItemLayout } from './components/brc20-token-asset-item.layout';
import { Brc20AssetListLayout } from './components/brc20-token-asset-list.layout';

export function Brc20TokenAssetList(props: { brc20Tokens?: Brc20Token[] }) {
  const navigate = useNavigate();
  const currentAccountBtcAddress = useCurrentAccountNativeSegwitAddressIndexZero();
  const btcCryptoCurrencyAssetBalance = useNativeSegwitBalance(currentAccountBtcAddress);

  const hasPositiveBtcBalanceForFees =
    btcCryptoCurrencyAssetBalance.balance.amount.isGreaterThan(0);

  function navigateToBrc20SendForm(token: Brc20Token) {
    const { tick, available_balance, decimals } = token;
    navigate(RouteUrls.SendBrc20SendForm.replace(':ticker', tick), {
      state: { balance: available_balance, tick, decimals },
    });
  }

  if (!props.brc20Tokens?.length) return null;

  return (
    <Brc20AssetListLayout>
      {props.brc20Tokens?.map(token => (
        <Brc20TokenAssetItemLayout
          key={token.tick}
          displayNotEnoughBalance={!hasPositiveBtcBalanceForFees}
          token={token}
          onClick={hasPositiveBtcBalanceForFees ? () => navigateToBrc20SendForm(token) : noop}
        />
      ))}
    </Brc20AssetListLayout>
  );
}
