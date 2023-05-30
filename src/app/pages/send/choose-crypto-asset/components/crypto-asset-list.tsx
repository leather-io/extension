import { useNavigate } from 'react-router-dom';

import type { AllTransferableCryptoAssetBalances } from '@shared/models/crypto-asset-balance.model';
import { RouteUrls } from '@shared/route-urls';

import { Brc20TokenAssetItem } from '@app/components/crypto-assets/bitcoin/brc20-token-asset/brc20-token-asset-item';
import { Brc20Token } from '@app/query/bitcoin/ordinals/brc20/brc20-tokens.query';

import { CryptoAssetListItem } from './crypto-asset-list-item';
import { CryptoAssetListLayout } from './crypto-asset-list.layout';

interface CryptoAssetListProps {
  cryptoAssetBalances: AllTransferableCryptoAssetBalances[];
  brc20Tokens: Brc20Token[];
}
export function CryptoAssetList({ cryptoAssetBalances, brc20Tokens }: CryptoAssetListProps) {
  const navigate = useNavigate();

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
        <Brc20TokenAssetItem
          key={token.tick}
          token={token}
          isPressable={true}
          onClick={() => navigateToBrc20SendForm(token)}
        />
      ))}
    </CryptoAssetListLayout>
  );
}
