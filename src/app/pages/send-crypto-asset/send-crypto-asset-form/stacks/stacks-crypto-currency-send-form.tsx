import { useNavigate } from 'react-router-dom';

import type { AllTransferableCryptoAssetBalances } from '@shared/models/crypto-asset-balance.model';
import { RouteUrls } from '@shared/route-urls';

import { useRouteHeader } from '@app/common/hooks/use-route-header';
import { Header } from '@app/components/header';

interface StacksCryptoCurrencySendFormProps {
  assetBalance: AllTransferableCryptoAssetBalances;
}
// TODO: Placeholder form
export function StacksCryptoCurrencySendForm({ assetBalance }: StacksCryptoCurrencySendFormProps) {
  const navigate = useNavigate();
  useRouteHeader(
    <Header hideActions onClose={() => navigate(RouteUrls.SendCryptoAsset)} title={' '} />
  );
  // eslint-disable-next-line no-console
  console.log(assetBalance);
  return <>{assetBalance.asset.symbol} Send Form</>;
}
