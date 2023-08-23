import { useSwapContext } from '@app/pages/swap/swap.context';

import { SwapDetailLayout } from './swap-detail.layout';
import { SwapDetailsLayout } from './swap-details.layout';
import {isDefined} from "@shared/utils";

export function SwapDetails() {
  const { swapSubmissionData } = useSwapContext();
  if (!isDefined(swapSubmissionData)) {
    return null;
  }
  return (
    <SwapDetailsLayout>
      <SwapDetailLayout
        title="Route"
        value={swapSubmissionData.router.map(x => x.name).join(' > ')}
      />
      <SwapDetailLayout
        title="Liquidity Provider Fee"
        tooltipLabel="To receive a share of these fees, become a Liquidity Provider through 'Pool'"
        value={`${swapSubmissionData.liquidityFee} ${swapSubmissionData.swapAssetFrom.name}`}
      />
      <SwapDetailLayout
        title="Slippage Tolerance"
        value={`${swapSubmissionData.slippage * 100}%`}
      />
      <SwapDetailLayout
        title="Minimum Received"
        value={`${Number(swapSubmissionData.swapAmountTo) * (1 - swapSubmissionData.slippage)} ${
          swapSubmissionData.swapAssetTo.name
        }`}
      />
    </SwapDetailsLayout>
  );
}
