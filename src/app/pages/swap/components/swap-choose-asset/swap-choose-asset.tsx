import { useLocation, useNavigate } from 'react-router-dom';

import get from 'lodash.get';

import { RouteUrls } from '@shared/route-urls';

import { Dialog } from '@app/ui/components/containers/dialog/dialog';
import { Header } from '@app/ui/components/containers/headers/header';

import { useSwapContext } from '../../swap.context';
import { SwapAssetList } from './components/swap-asset-list';

export function useSwapChooseAssetState() {
  const location = useLocation();
  const swapListType = get(location.state, 'swap') as string;
  return { swapListType };
}

export function SwapChooseAsset() {
  const { swappableAssetsFrom, swappableAssetsTo } = useSwapContext();
  const { swapListType } = useSwapChooseAssetState();
  const navigate = useNavigate();

  const isFromList = swapListType === 'from';

  const title = isFromList ? (
    <>
      Choose asset <br /> to swap
    </>
  ) : (
    <>
      Choose asset <br /> to receive
    </>
  );

  return (
    <Dialog
      isShowing
      onClose={() => navigate(RouteUrls.Swap)}
      header={<Header title={title} variant="bigTitle" onGoBack={() => navigate(RouteUrls.Swap)} />}
    >
      <SwapAssetList assets={isFromList ? swappableAssetsFrom : swappableAssetsTo} />
    </Dialog>
  );
}
