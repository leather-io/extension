import { useNavigate } from 'react-router-dom';

import { RouteUrls } from '@shared/route-urls';

import { useRouteHeader } from '@app/common/hooks/use-route-header';
import { useAllTransferableCryptoAssetBalances } from '@app/common/hooks/use-transferable-asset-balances.hooks';
import { useWalletType } from '@app/common/use-wallet-type';
import { Header } from '@app/components/header';

import { ChooseCryptoAssetLayout } from './components/choose-crypto-asset.layout';
import { CryptoAssetList } from './components/crypto-asset-list';

export function ChooseCryptoAsset() {
  const navigate = useNavigate();
  const allTransferableCryptoAssetBalances = useAllTransferableCryptoAssetBalances();
  const { whenWallet } = useWalletType();

  useRouteHeader(<Header hideActions onClose={() => navigate(RouteUrls.Home)} title=" " />);

  return (
    <ChooseCryptoAssetLayout>
      <CryptoAssetList
        cryptoAssetBalances={allTransferableCryptoAssetBalances.filter(balance =>
          whenWallet({
            ledger: balance.asset.symbol !== 'BTC',
            software: true,
          })
        )}
      />
    </ChooseCryptoAssetLayout>
  );
}
