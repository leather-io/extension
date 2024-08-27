import { Sheet, SheetHeader } from '@leather.io/ui';

import { RouteUrls } from '@shared/route-urls';

import { useSwapNavigate } from '../../hooks/use-swap-navigate';
import { useSwapContext } from '../../swap.context';
import { SwapAssetList } from './components/swap-asset-list';

export function SwapAssetSheetQuote() {
  const { swappableAssetsQuote } = useSwapContext();
  const navigate = useSwapNavigate();

  return (
    <Sheet
      isShowing
      onClose={() => navigate(RouteUrls.Swap)}
      header={
        <SheetHeader
          title={
            <>
              Choose asset <br /> to receive
            </>
          }
          variant="large"
          onClose={() => navigate(RouteUrls.Swap)}
        />
      }
    >
      <SwapAssetList assets={swappableAssetsQuote} type="quote" />
    </Sheet>
  );
}
