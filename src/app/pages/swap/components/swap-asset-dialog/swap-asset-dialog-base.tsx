import { Dialog } from '@leather.io/ui';

import { RouteUrls } from '@shared/route-urls';

import { DialogHeader } from '@app/features/container/containers/headers/dialog-header';

import { useSwapNavigate } from '../../hooks/use-swap-navigate';
import { useSwapContext } from '../../swap.context';
import { SwapAssetList } from './components/swap-asset-list';

export function SwapAssetDialogBase() {
  const { swappableAssetsBase } = useSwapContext();
  const navigate = useSwapNavigate();

  return (
    <Dialog
      isShowing
      onClose={() => navigate(RouteUrls.Swap)}
      header={
        <DialogHeader
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
    </Dialog>
  );
}
