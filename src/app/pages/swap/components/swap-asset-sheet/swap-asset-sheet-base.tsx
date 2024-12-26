import { Sheet, SheetHeader } from '@leather.io/ui';

import { RouteUrls } from '@shared/route-urls';

import { useSwapNavigate } from '../../hooks/use-swap-navigate';
import { type BaseSwapContext, useSwapContext } from '../../swap.context';
import { constructSwapRoute } from '../../swap.routes';
import { SwapAssetList } from './components/swap-asset-list';

export function SwapAssetSheetBase<T extends BaseSwapContext<T>>() {
  const { swapData } = useSwapContext<T>();
  const swapNavigate = useSwapNavigate();

  function onClose() {
    return swapNavigate(
      constructSwapRoute({
        chain: swapData.chain,
        route: RouteUrls.Swap,
      })
    );
  }

  return (
    <Sheet
      isShowing
      onClose={onClose}
      header={
        <SheetHeader
          title={
            <>
              Choose asset <br /> to swap
            </>
          }
          variant="large"
          onClose={onClose}
        />
      }
    >
      <SwapAssetList assets={swapData.swappableAssetsBase} type="base" />
    </Sheet>
  );
}
