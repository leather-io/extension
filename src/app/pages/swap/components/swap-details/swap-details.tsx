import { isUndefined } from '@shared/utils';

import { formatMoney } from '@app/common/money/format-money';
import { getEstimatedConfirmationTime } from '@app/common/transactions/stacks/transaction.utils';
import { convertToMoneyTypeWithDefaultOfZero } from '@app/pages/send/send-crypto-asset-form/components/confirmation/send-form-confirmation.utils';
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
      <SwapDetailLayout
        title="Route"
        value={swapSubmissionData.router.map(x => x.name).join(' > ')}
      />
      <SwapDetailLayout
        title="Transaction fees"
        value={formatMoney(
          convertToMoneyTypeWithDefaultOfZero('STX', Number(swapSubmissionData.fee))
        )}
      />
      <SwapDetailLayout
        title="Estimated confirmation time"
        value={getEstimatedConfirmationTime(isTestnet, blockTime)}
      />
      <SwapDetailLayout
        title="Slippage Tolerance"
        value={`${swapSubmissionData.slippage * 100}%`}
      />
      <SwapDetailLayout title="Protocol" value={swapSubmissionData.protocol} />
      <SwapDetailLayout
        title="Liquidity Provider Fee"
        tooltipLabel="To receive a share of these fees, become a Liquidity Provider through 'Pool'"
        value={`${swapSubmissionData.liquidityFee} ${swapSubmissionData.swapAssetFrom.name}`}
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
