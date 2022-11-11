import { useNavigate } from 'react-router-dom';

import { RouteUrls } from '@shared/route-urls';

import { useRouteHeader } from '@app/common/hooks/use-route-header';
import { Header } from '@app/components/header';
import { useAllTransferableCryptoAssetBalances } from '@app/pages/send-crypto-asset/send-crypto-assets.hooks';

import { SendCryptoAssetLayout } from './components/send-crypto-asset.layout';
import { CryptoAssetList } from './crypto-asset-list';

export function SendCryptoAsset() {
  const navigate = useNavigate();
  const allTransferableCryptoAssetBalances = useAllTransferableCryptoAssetBalances();

  useRouteHeader(<Header hideActions onClose={() => navigate(RouteUrls.Home)} title=" " />);

  return (
    <SendCryptoAssetLayout>
      <CryptoAssetList cryptoAssetBalances={allTransferableCryptoAssetBalances} />
    </SendCryptoAssetLayout>
  );
}
