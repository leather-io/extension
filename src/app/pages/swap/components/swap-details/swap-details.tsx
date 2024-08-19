import { SwapSelectors } from '@tests/selectors/swap.selectors';
import BigNumber from 'bignumber.js';
import { HStack, styled } from 'leather-styles/jsx';

import { useGetStacksNetworkBlockTimeQuery } from '@leather.io/query';
import { ChevronRightIcon } from '@leather.io/ui';
import {
  createMoneyFromDecimal,
  formatMoneyPadded,
  isDefined,
  isUndefined,
  microStxToStx,
} from '@leather.io/utils';

import { getEstimatedConfirmationTime } from '@app/common/transactions/stacks/transaction.utils';
import { SwapSubmissionData, useSwapContext } from '@app/pages/swap/swap.context';
import { useCurrentNetworkState } from '@app/store/networks/networks.hooks';

import { SwapDetailLayout } from './swap-detail.layout';
import { SwapDetailsLayout } from './swap-details.layout';

function RouteNames(props: { swapSubmissionData: SwapSubmissionData }) {
  return props.swapSubmissionData.router.map((route, i) => {
    const insertIcon = isDefined(props.swapSubmissionData.router[i + 1]);
    return (
      <HStack gap="space.01" key={route.name}>
        <styled.span>{route.name}</styled.span>
        {insertIcon && <ChevronRightIcon variant="small" />}
      </HStack>
    );
  });
}

const sponsoredFeeLabel =
  'Sponsorship may not apply when you have pending transactions. In such cases, if you choose to proceed, the associated costs will be deducted from your balance.';

export function SwapDetails() {
  const { swapSubmissionData } = useSwapContext();
  const { isTestnet } = useCurrentNetworkState();
  const { data: blockTime } = useGetStacksNetworkBlockTimeQuery();

  if (
    isUndefined(swapSubmissionData) ||
    isUndefined(swapSubmissionData.swapAssetBase) ||
    isUndefined(swapSubmissionData.swapAssetQuote)
  )
    return null;

  const formattedMinToReceive = formatMoneyPadded(
    createMoneyFromDecimal(
      new BigNumber(swapSubmissionData.swapAmountQuote).times(1 - swapSubmissionData.slippage),
      swapSubmissionData.swapAssetQuote.balance.symbol,
      swapSubmissionData.swapAssetQuote.balance.decimals
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
        value={`${swapSubmissionData.liquidityFee} ${swapSubmissionData.swapAssetBase.name}`}
      />
      <SwapDetailLayout
        title="Transaction fees"
        tooltipLabel={swapSubmissionData.sponsored ? sponsoredFeeLabel : undefined}
        value={
          swapSubmissionData.sponsored
            ? 'Sponsored'
            : `${microStxToStx(swapSubmissionData.fee).toString()} STX`
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
