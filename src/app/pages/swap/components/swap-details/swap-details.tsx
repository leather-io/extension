import { isUndefined } from '@shared/utils';

import { getEstimatedConfirmationTime } from '@app/common/transactions/stacks/transaction.utils';
import { useSwapContext } from '@app/pages/swap/swap.context';
import { useStacksBlockTime } from '@app/query/stacks/info/info.hooks';
import { useCurrentNetworkState } from '@app/store/networks/networks.hooks';

import { SwapDetailLayout } from './swap-detail.layout';
import { SwapDetailsLayout } from './swap-details.layout';

export function SwapDetails() {
  const { swapSubmissionData } = useSwapContext();
  const { isTestnet } = useCurrentNetworkState();
  const { data: blockTime } = useStacksBlockTime();

  if (
    isUndefined(swapSubmissionData) ||
    isUndefined(swapSubmissionData.swapAssetFrom) ||
    isUndefined(swapSubmissionData.swapAssetTo)
  )
    return null;

  return (
    <SwapDetailsLayout>
      <SwapDetailLayout title="Protocol" value={swapSubmissionData.protocol} />
      <SwapDetailLayout
        title="Route"
        value={swapSubmissionData.router.map(x => x.name).join(' > ')}
      />
      <SwapDetailLayout
        title="Minimum Received"
        value={`${Number(swapSubmissionData.swapAmountTo) * (1 - swapSubmissionData.slippage)} ${
          swapSubmissionData.swapAssetTo.name
        }`}
      />
      <SwapDetailLayout
        title="Slippage Tolerance"
        value={`${swapSubmissionData.slippage * 100}%`}
      />
      <SwapDetailLayout
        title="Liquidity Provider Fee"
        tooltipLabel="To receive a share of these fees, become a Liquidity Provider through 'Pool'"
        value={`${swapSubmissionData.liquidityFee} ${swapSubmissionData.swapAssetFrom.name}`}
      />
      {/* Alex transactions are sponsored */}
      <SwapDetailLayout title="Transaction fees" value="Sponsored" />
      <SwapDetailLayout
        title="Estimated confirmation time"
        value={getEstimatedConfirmationTime(isTestnet, blockTime)}
      />
      <SwapDetailLayout title="Nonce" value={swapSubmissionData.nonce?.toString() ?? 'Unknown'} />
    </SwapDetailsLayout>
  );
}
