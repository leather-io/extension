import { Dialog, DialogHeader } from '@leather.io/ui';

import { RouteUrls } from '@shared/route-urls';

import { useSwapNavigate } from '../../hooks/use-swap-navigate';
import { useSwapContext } from '../../swap.context';
import { SwapAssetList } from './components/swap-asset-list';

export function SwapAssetDialogQuote() {
  const { swappableAssetsQuote } = useSwapContext();
  const navigate = useSwapNavigate();

  return (
    <Dialog
      isShowing
      onClose={() => navigate(RouteUrls.Swap)}
      header={
        <DialogHeader
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
    </Dialog>
  );
}
