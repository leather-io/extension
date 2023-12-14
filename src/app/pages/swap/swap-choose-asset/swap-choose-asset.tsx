import { useLocation, useNavigate } from 'react-router-dom';

import { SwapSelectors } from '@tests/selectors/swap.selectors';
import { Box, styled } from 'leather-styles/jsx';
import get from 'lodash.get';

import { BaseDrawer } from '@app/components/drawer/base-drawer';

import { useSwapContext } from '../swap.context';
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
      Choose asset
      <br />
      to swap
    </>
  ) : (
    <>
      Choose asset
      <br />
      to receive
    </>
  );

  return (
    <BaseDrawer title="" isShowing onClose={() => navigate(-1)}>
      <Box data-testid={SwapSelectors.ChooseAssetList} mx="space.06">
        <styled.h1 mb="space.05" textStyle="heading.03">
          {title}
        </styled.h1>
        <SwapAssetList assets={isFromList ? swappableAssetsFrom : swappableAssetsTo} />
      </Box>
    </BaseDrawer>
  );
}
