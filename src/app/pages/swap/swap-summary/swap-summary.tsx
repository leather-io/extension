import toast from 'react-hot-toast';
import { FiCopy, FiExternalLink } from 'react-icons/fi';
import { useLocation } from 'react-router-dom';

import { Box, Stack, Text, useClipboard } from '@stacks/ui';
import get from 'lodash.get';

import { useAnalytics } from '@app/common/hooks/analytics/use-analytics';
// import { useExplorerLink } from '@app/common/hooks/use-explorer-link';
import { useRouteHeader } from '@app/common/hooks/use-route-header';
import { CheckCircleIcon } from '@app/components/icons/check-circle-icon';
import { InfoCardBtn, InfoCardFooter } from '@app/components/info-card/info-card';
import { ModalHeader } from '@app/components/modal-header';
import { Title } from '@app/components/typography';

import { SwapAssetsPair } from '../components/swap-assets-pair/swap-assets-pair';
import { SwapDetails } from '../components/swap-details/swap-details';
import { SwapStatus } from '../components/swap-status/swap-status';
import { SwapLayout } from '../components/swap.layout';
import { useAmountAsFiat } from '../hooks/use-amount-as-fiat';
import { SwapAsset } from '../hooks/use-swap';
import { SwapSummaryTabs } from './swap-summary-tabs';
import { SwapSummaryLayout } from './swap-summary.layout';

function useSwapSummaryState() {
  const location = useLocation();

  return {
    swapAmountFrom: get(location.state, 'swapAmountFrom') as string,
    swapAmountTo: get(location.state, 'swapAmountTo') as string,
    swapAssetFrom: get(location.state, 'swapAssetFrom') as SwapAsset,
    swapAssetTo: get(location.state, 'swapAssetTo') as SwapAsset,
  };
}

// TODO: Pass/replace state with tx data where needed and handle click events
export function SwapSummary() {
  const analytics = useAnalytics();
  const { onCopy } = useClipboard('');
  // const { handleOpenTxLink } = useExplorerLink();
  const { swapAmountFrom, swapAmountTo, swapAssetFrom, swapAssetTo } = useSwapSummaryState();

  useRouteHeader(<ModalHeader defaultClose hideActions title="Submitted" />, true);

  const amountAsFiat = useAmountAsFiat(swapAssetTo.balance, swapAmountTo);

  function onClickCopy() {
    onCopy();
    toast.success('ID copied!');
  }

  function onClickLink() {
    void analytics.track('view_transaction_confirmation', { symbol: '' });
    // handleOpenTxLink(txLink);
  }

  return (
    <SwapSummaryLayout>
      <SwapLayout>
        <Box width="100px">
          <CheckCircleIcon />
        </Box>
        <Title fontSize={8} my="loose">
          All done
        </Title>
        <Title fontSize={4}>
          {swapAmountTo} {swapAssetTo.balance.symbol}
        </Title>
        <Text fontWeight={500} mb="loose">
          ~{amountAsFiat}
        </Text>
        <SwapAssetsPair
          amountFrom={swapAmountFrom}
          amountTo={swapAmountTo}
          assetFrom={swapAssetFrom}
          assetTo={swapAssetTo}
        />
        <SwapSummaryTabs details={<SwapDetails />} status={<SwapStatus />} />
      </SwapLayout>
      <InfoCardFooter>
        <Stack isInline spacing="base" width="100%">
          <InfoCardBtn icon={FiExternalLink} label="View Details" onClick={onClickLink} />
          <InfoCardBtn icon={FiCopy} label="Copy ID" onClick={onClickCopy} />
        </Stack>
      </InfoCardFooter>
    </SwapSummaryLayout>
  );
}
