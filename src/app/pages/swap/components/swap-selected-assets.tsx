import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { useFormikContext } from 'formik';

import { RouteUrls } from '@shared/route-urls';
import { isUndefined } from '@shared/utils';

import { SwapFormValues } from '../hooks/use-swap';
import { SwapSelectedAssetFrom } from './swap-selected-asset-from';
import { SwapSelectedAssetPlaceholder } from './swap-selected-asset-placeholder';
import { SwapSelectedAssetTo } from './swap-selected-asset-to';
import { SwapToggleButton } from './swap-toggle-button';

const from = 'Convert';
const to = 'To';

export function SwapSelectedAssets() {
  const [isSendingMax, setIsSendingMax] = useState(false);
  const { values } = useFormikContext<SwapFormValues>();
  const navigate = useNavigate();

  function onChooseAssetFrom() {
    navigate(RouteUrls.SwapChooseAsset, { state: { swap: 'from' } });
  }

  function onChooseAssetTo() {
    navigate(RouteUrls.SwapChooseAsset, { state: { swap: 'to' } });
  }

  function onSetIsSendingMax(value: boolean) {
    setIsSendingMax(value);
  }

  return (
    <>
      {isUndefined(values.swapAssetFrom) ? (
        <SwapSelectedAssetPlaceholder onChooseAsset={onChooseAssetFrom} title={from} />
      ) : (
        <SwapSelectedAssetFrom
          isSendingMax={isSendingMax}
          onChooseAsset={onChooseAssetFrom}
          onSetIsSendingMax={onSetIsSendingMax}
          title={from}
        />
      )}
      <SwapToggleButton onSetIsSendingMax={onSetIsSendingMax} />
      {isUndefined(values.swapAssetTo) ? (
        <SwapSelectedAssetPlaceholder onChooseAsset={onChooseAssetTo} title={to} />
      ) : (
        <SwapSelectedAssetTo onChooseAsset={onChooseAssetTo} title={to} />
      )}
    </>
  );
}
