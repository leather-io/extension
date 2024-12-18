import { SwapSelectors } from '@tests/selectors/swap.selectors';
import BigNumber from 'bignumber.js';
import { HStack, styled } from 'leather-styles/jsx';

import { ChevronRightIcon } from '@leather.io/ui';
import {
  convertAmountToBaseUnit,
  createMoney,
  createMoneyFromDecimal,
  formatMoneyPadded,
  isDefined,
  isUndefined,
  satToBtc,
} from '@leather.io/utils';

import { SwapSubmissionData, useSwapContext } from '@app/pages/swap/swap.context';

import { toCommaSeparatedWithAnd } from '../../swap.utils';
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

  if (
    isUndefined(swapSubmissionData) ||
    isUndefined(swapSubmissionData.swapAssetBase) ||
    isUndefined(swapSubmissionData.swapAssetQuote)
  )
    return null;

  const maxSignerFee = satToBtc(swapSubmissionData.maxSignerFee ?? 0);

  const formattedMinToReceive = formatMoneyPadded(
    createMoneyFromDecimal(
      new BigNumber(swapSubmissionData.swapAmountQuote)
        .times(1 - swapSubmissionData.slippage)
        .minus(maxSignerFee),
      swapSubmissionData.swapAssetQuote.balance.symbol,
      swapSubmissionData.swapAssetQuote.balance.decimals
    )
  );

  const getFormattedPoweredBy = () => {
    const uniqueDexList = Array.from(new Set(swapSubmissionData.dexPath));
    const isOnlySwapProtocol =
      uniqueDexList.length === 1 && uniqueDexList[0] === swapSubmissionData.protocol;
    return isOnlySwapProtocol || !uniqueDexList.length
      ? swapSubmissionData.protocol
      : `${toCommaSeparatedWithAnd(uniqueDexList)} via ${swapSubmissionData.protocol}`;
  };

  return (
    <SwapDetailsLayout>
      <SwapDetailLayout
        dataTestId={SwapSelectors.SwapDetailsProtocol}
        title="Powered by"
        value={getFormattedPoweredBy()}
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
        value={`${swapSubmissionData.liquidityFee.toFixed(1)}%`}
      />
      {maxSignerFee ? (
        <SwapDetailLayout title="Max signer fee" value={maxSignerFee.toString()} />
      ) : null}
      <SwapDetailLayout
        title="Transaction fees"
        tooltipLabel={swapSubmissionData.sponsored ? sponsoredFeeLabel : undefined}
        value={
          swapSubmissionData.sponsored
            ? 'Sponsored'
            : `${convertAmountToBaseUnit(
                createMoney(new BigNumber(swapSubmissionData.fee), swapSubmissionData.feeCurrency)
              ).toString()} ${swapSubmissionData.feeCurrency}`
        }
      />
      {Number(swapSubmissionData?.nonce) >= 0 ? (
        <SwapDetailLayout title="Nonce" value={swapSubmissionData.nonce?.toString()} />
      ) : null}
    </SwapDetailsLayout>
  );
}
