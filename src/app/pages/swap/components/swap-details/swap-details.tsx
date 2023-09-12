import { useSwapType } from '../../hooks/use-swap-type';
import { SwapType } from '../../swap.utils';
import { SwapDetailLayout } from './swap-detail.layout';
import { SwapDetailsMagicInbound } from './swap-details-magic';
import { SwapDetailsLayout } from './swap-details.layout';

// TODO: Replace with live data
export function SwapDetails() {
  const swapType = useSwapType();

  switch  (swapType) {
    case SwapType.MagicSwapInbound:
      return <SwapDetailsMagicInbound />;

    default:
      return (
        <SwapDetailsLayout>
          <SwapDetailLayout title="Placeholder" tooltipLabel="Tooltip info" value="0" />
          <SwapDetailLayout title="Placeholder" value="0" />
          <SwapDetailLayout title="Placeholder" value="0" />
          <SwapDetailLayout title="Placeholder" value="0" />
        </SwapDetailsLayout>
      );
  }
}
