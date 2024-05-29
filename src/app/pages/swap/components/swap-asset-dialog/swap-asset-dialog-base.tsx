import { Dialog, Header } from '@leather-wallet/ui';

import { RouteUrls } from '@shared/route-urls';

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
        <Header
          title={
            <>
              Choose asset <br /> to swap
            </>
          }
          variant="bigTitle"
          onGoBack={() => navigate(RouteUrls.Swap)}
        />
      }
    >
      <SwapAssetList assets={swappableAssetsBase} type="base" />
    </Dialog>
  );
}
