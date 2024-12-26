import { SwapSelectors } from '@tests/selectors/swap.selectors';
import BigNumber from 'bignumber.js';
import { useFormikContext } from 'formik';
import { HStack, styled } from 'leather-styles/jsx';

import type { SwapAsset } from '@leather.io/query';
import { ChevronRightIcon } from '@leather.io/ui';
import { createMoneyFromDecimal, formatMoney, isDefined, isUndefined } from '@leather.io/utils';

import type { SwapFormValues } from '@shared/models/form.model';

import { useSwapContext } from '@app/pages/swap/swap.context';

import type { StacksSwapContext } from '../../providers/stacks-swap-provider';
import { toCommaSeparatedWithAnd } from '../../swap.utils';
import { SwapDetailLayout } from './swap-detail.layout';
import { SwapDetailsLayout } from './swap-details.layout';
import { getStacksSwapDataFromRouteQuote } from './swap-details.utils';

function RouterSwapRoute(props: { router?: SwapAsset[] }) {
  const { router } = props;
  if (!router) return;
  return router.map((route, i) => {
    const insertIcon = isDefined(router[i + 1]);
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

export function StacksSwapDetails() {
  const { swapData } = useSwapContext<StacksSwapContext>();
  const { values } = useFormikContext<SwapFormValues>();

  if (isUndefined(values.swapAssetBase) || isUndefined(values.swapAssetQuote)) return null;

  const routeQuoteDetails =
    swapData.routeQuote &&
    getStacksSwapDataFromRouteQuote({
      routeQuote: swapData.routeQuote,
      swapAssets: swapData.swappableAssetsBase,
    });

  const minToReceive = createMoneyFromDecimal(
    new BigNumber(values.swapAmountQuote).times(1 - swapData.slippage),
    values.swapAssetQuote.balance.symbol,
    values.swapAssetQuote.balance.decimals
  );

  const getFormattedPoweredBy = () => {
    const uniqueDexList = Array.from(new Set(routeQuoteDetails?.dexPath));
    const isOnlySwapProtocol = uniqueDexList.length === 1 && uniqueDexList[0] === swapData.protocol;
    return isOnlySwapProtocol || !uniqueDexList.length
      ? swapData.protocol
      : `${toCommaSeparatedWithAnd(uniqueDexList)} via ${swapData.protocol}`;
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
            <RouterSwapRoute router={routeQuoteDetails?.router} />
          </HStack>
        }
      />
      <SwapDetailLayout title="Min to receive" value={formatMoney(minToReceive)} />
      <SwapDetailLayout title="Slippage tolerance" value={`${swapData.slippage * 100}%`} />
      <SwapDetailLayout
        title="Liquidity provider fee"
        value={`${routeQuoteDetails?.liquidityFee.toFixed(1)}%`}
      />
      <SwapDetailLayout
        title="Transaction fees"
        tooltipLabel={swapData.sponsorship?.isEligible ? sponsoredFeeLabel : undefined}
        value={swapData.sponsorship?.isEligible ? 'Sponsored' : formatMoney(swapData.fee)}
      />
      <SwapDetailLayout title="Nonce" value={swapData.nonce.toString()} />
    </SwapDetailsLayout>
  );
}
