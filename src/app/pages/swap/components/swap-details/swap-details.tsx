import { SwapSelectors } from '@tests/selectors/swap.selectors';
import BigNumber from 'bignumber.js';
import { HStack, styled } from 'leather-styles/jsx';

import { createMoneyFromDecimal } from '@shared/models/money.model';
import { isDefined, isUndefined } from '@shared/utils';

import { formatMoneyPadded } from '@app/common/money/format-money';
import { microStxToStx } from '@app/common/money/unit-conversion';
import { getEstimatedConfirmationTime } from '@app/common/transactions/stacks/transaction.utils';
import { SwapSubmissionData, useSwapContext } from '@app/pages/swap/swap.context';
import { useStacksBlockTime } from '@app/query/stacks/info/info.hooks';
import { useCurrentNetworkState } from '@app/store/networks/networks.hooks';
import { ChevronUpIcon } from '@app/ui/components/icons/chevron-up-icon';

import { SwapDetailLayout } from './swap-detail.layout';
import { SwapDetailsLayout } from './swap-details.layout';

function RouteNames(props: { swapSubmissionData: SwapSubmissionData }) {
  return props.swapSubmissionData.router.map((route, i) => {
    const insertIcon = isDefined(props.swapSubmissionData.router[i + 1]);
    return (
      <HStack gap="space.01" key={route.name}>
        <styled.span>{route.name}</styled.span>
        {insertIcon && <ChevronUpIcon transform="rotate(90deg)" />}
      </HStack>
    );
  });
}

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

  const formattedMinToReceive = formatMoneyPadded(
    createMoneyFromDecimal(
      new BigNumber(swapSubmissionData.swapAmountTo).times(1 - swapSubmissionData.slippage),
      swapSubmissionData.swapAssetTo.balance.symbol,
      swapSubmissionData.swapAssetTo.balance.decimals
    )
  );

  return (
    <SwapDetailsLayout>
      <SwapDetailLayout
        dataTestId={SwapSelectors.SwapDetailsProtocol}
        title="Powered by"
        value={swapSubmissionData.protocol}
      />
      <SwapDetailLayout
        title="Route"
        value={
          <HStack gap="space.01">
            <RouteNames swapSubmissionData={swapSubmissionData} />
          </HStack>
        }
      />
      <SwapDetailLayout title="Min to receive" value={formattedMinToReceive} />
      <SwapDetailLayout
        title="Slippage tolerance"
        value={`${swapSubmissionData.slippage * 100}%`}
      />
      <SwapDetailLayout
        title="Liquidity provider fee"
        tooltipLabel="To receive a share of these fees, become a Liquidity Provider on app.alexlab.co."
        value={`${swapSubmissionData.liquidityFee} ${swapSubmissionData.swapAssetFrom.name}`}
      />
      <SwapDetailLayout
        title="Transaction fees"
        tooltipLabel="Swap transactions are sponsored by default. However, this sponsorship may not apply when you have pending transactions. In such cases, if you choose to proceed, the associated costs will be deducted from your balance."
        value={
          swapSubmissionData.sponsored
            ? 'Sponsored'
            : microStxToStx(swapSubmissionData.fee).toString()
        }
      />
      <SwapDetailLayout
        title="Estimated confirmation time"
        value={getEstimatedConfirmationTime(isTestnet, blockTime)}
      />
      <SwapDetailLayout title="Nonce" value={swapSubmissionData.nonce?.toString() ?? 'Unknown'} />
    </SwapDetailsLayout>
  );
}
