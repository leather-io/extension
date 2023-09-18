import { useNavigate } from 'react-router-dom';

import { useFormikContext } from 'formik';

import { RouteUrls } from '@shared/route-urls';
import { isUndefined } from '@shared/utils';

import { LoadingSpinner } from '@app/components/loading-spinner';

import { SwapFormValues } from '../hooks/use-swap-form';
import { SwapSelectedAssetFrom } from './swap-selected-asset-from';
import { SwapSelectedAssetTo } from './swap-selected-asset-to';

const titleFrom = 'You pay';
const titleTo = 'You receive';

export function SwapSelectedAssets() {
  const { values } = useFormikContext<SwapFormValues>();
  const navigate = useNavigate();

  function onChooseAssetFrom() {
    navigate(RouteUrls.SwapChooseAsset, { state: { swap: 'from' } });
  }

  function onChooseAssetTo() {
    navigate(RouteUrls.SwapChooseAsset, { state: { swap: 'to' } });
  }

  if (isUndefined(values.swapAssetFrom)) return <LoadingSpinner height="300px" />;

  return (
    <>
      <SwapSelectedAssetFrom onChooseAsset={onChooseAssetFrom} title={titleFrom} />
      <SwapSelectedAssetTo onChooseAsset={onChooseAssetTo} title={titleTo} />
    </>
  );
}
