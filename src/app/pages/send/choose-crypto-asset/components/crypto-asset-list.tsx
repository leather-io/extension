import { useNavigate } from 'react-router-dom';

import type { AllTransferableCryptoAssetBalances } from '@shared/models/crypto-asset-balance.model';
import { RouteUrls } from '@shared/route-urls';
import { noop } from '@shared/utils';

import { Brc20TokenAssetItem } from '@app/components/crypto-assets/bitcoin/brc20-token-asset/brc20-token-asset-item';
import { Tooltip } from '@app/components/tooltip';
import { useNativeSegwitBalance } from '@app/query/bitcoin/balance/bitcoin-balances.query';
import { Brc20Token } from '@app/query/bitcoin/ordinals/brc20/brc20-tokens.query';
import { useCurrentAccountNativeSegwitAddressIndexZero } from '@app/store/accounts/blockchain/bitcoin/native-segwit-account.hooks';

import { CryptoAssetListItem } from './crypto-asset-list-item';
import { CryptoAssetListLayout } from './crypto-asset-list.layout';

interface CryptoAssetListProps {
  cryptoAssetBalances: AllTransferableCryptoAssetBalances[];
  brc20Tokens: Brc20Token[];
}
export function CryptoAssetList({ cryptoAssetBalances, brc20Tokens }: CryptoAssetListProps) {
  const navigate = useNavigate();
  const currentAccountBtcAddress = useCurrentAccountNativeSegwitAddressIndexZero();
  const btcCryptoCurrencyAssetBalance = useNativeSegwitBalance(currentAccountBtcAddress);

  const hasPositiveBtcBalanceForFees =
    btcCryptoCurrencyAssetBalance.balance.amount.isGreaterThan(0);

  function navigateToBrc20SendForm(token: Brc20Token) {
    const { tick, available_balance } = token;
    navigate(RouteUrls.SendBrc20SendForm.replace(':ticker', tick), {
      state: { balance: available_balance, tick },
    });
  }

  return (
    <CryptoAssetListLayout>
      {cryptoAssetBalances.map(assetBalance => (
        <CryptoAssetListItem assetBalance={assetBalance} key={assetBalance.asset.name} />
      ))}
      {brc20Tokens.map(token => (
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
    </CryptoAssetListLayout>
  );
}
