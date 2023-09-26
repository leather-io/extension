import { useNavigate } from 'react-router-dom';

import { RouteUrls } from '@shared/route-urls';
import { noop } from '@shared/utils';

import { Brc20TokenAssetItem } from '@app/components/crypto-assets/bitcoin/brc20-token-asset-list/components/brc20-token-asset-item';
import { Tooltip } from '@app/components/tooltip';
import { useNativeSegwitBalance } from '@app/query/bitcoin/balance/btc-native-segwit-balance.hooks';
import { Brc20Token } from '@app/query/bitcoin/ordinals/brc20/brc20-tokens.query';
import { useCurrentAccountNativeSegwitAddressIndexZero } from '@app/store/accounts/blockchain/bitcoin/native-segwit-account.hooks';

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

  return (
    <Brc20AssetListLayout>
      {props.brc20Tokens?.map(token => (
        <Tooltip
          disabled={hasPositiveBtcBalanceForFees}
          key={token.tick}
          placement="top"
          label={'Not enough BTC in balance'}
          hideOnClick={false}
        >
          <Brc20TokenAssetItem
            token={token}
            isPressable={hasPositiveBtcBalanceForFees}
            onClick={hasPositiveBtcBalanceForFees ? () => navigateToBrc20SendForm(token) : noop}
          />
        </Tooltip>
      ))}
    </Brc20AssetListLayout>
  );
}
