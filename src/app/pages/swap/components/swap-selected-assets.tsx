import { useNavigate } from 'react-router-dom';

import { useFormikContext } from 'formik';

import { RouteUrls } from '@shared/route-urls';
import { isUndefined } from '@shared/utils';

import { SwapFormValues } from '../hooks/use-swap';
import { SwapSelectedAssetFrom } from './swap-selected-asset-from';
import { SwapSelectedAssetPlaceholder } from './swap-selected-asset-placeholder';
import { SwapSelectedAssetTo } from './swap-selected-asset-to';

const titleFrom = 'Convert';
const titleTo = 'To';

export function SwapSelectedAssets() {
  const { values } = useFormikContext<SwapFormValues>();
  const navigate = useNavigate();

  function onChooseAssetFrom() {
    navigate(RouteUrls.SwapChooseAsset, { state: { swap: 'from' } });
  }

  function onChooseAssetTo() {
    navigate(RouteUrls.SwapChooseAsset, { state: { swap: 'to' } });
  }

  return (
    <>
      {isUndefined(values.swapAssetFrom) ? (
        <SwapSelectedAssetPlaceholder onChooseAsset={onChooseAssetFrom} title={titleFrom} />
      ) : (
        <SwapSelectedAssetFrom onChooseAsset={onChooseAssetFrom} title={titleFrom} />
      )}
      {isUndefined(values.swapAssetTo) ? (
        <SwapSelectedAssetPlaceholder onChooseAsset={onChooseAssetTo} showToggle title={titleTo} />
      ) : (
        <SwapSelectedAssetTo onChooseAsset={onChooseAssetTo} title={titleTo} />
      )}
    </>
  );
}
