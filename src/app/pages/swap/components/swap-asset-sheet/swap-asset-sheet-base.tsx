import { Sheet, SheetHeader } from '@leather.io/ui';

import { RouteUrls } from '@shared/route-urls';

import { useSwapNavigate } from '../../hooks/use-swap-navigate';
import { useSwapContext } from '../../swap.context';
import { SwapAssetList } from './components/swap-asset-list';

export function SwapAssetSheetBase() {
  const { swappableAssetsBase } = useSwapContext();
  const navigate = useSwapNavigate();

  return (
    <Sheet
      isShowing
      onClose={() => navigate(RouteUrls.Swap)}
      header={
        <SheetHeader
          title={
            <>
              Choose asset <br /> to swap
            </>
          }
          variant="large"
          onClose={() => navigate(RouteUrls.Swap)}
        />
      }
    >
      <SwapAssetList assets={swappableAssetsBase} type="base" />
    </Sheet>
  );
}
