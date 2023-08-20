import toast from 'react-hot-toast';
import { FiCopy, FiExternalLink } from 'react-icons/fi';

import { Box, Stack, Text, useClipboard } from '@stacks/ui';
import { useFormikContext } from 'formik';

import { logger } from '@shared/logger';
import { isUndefined } from '@shared/utils';

import { useAnalytics } from '@app/common/hooks/analytics/use-analytics';
// import { useExplorerLink } from '@app/common/hooks/use-explorer-link';
import { useRouteHeader } from '@app/common/hooks/use-route-header';
import { CheckCircleIcon } from '@app/components/icons/check-circle-icon';
import { ModalHeader } from '@app/components/modal-header';
import { Title } from '@app/components/typography';

import { SwapAssetsPair } from '../components/swap-assets-pair/swap-assets-pair';
import { SwapContentLayout } from '../components/swap-content.layout';
import { SwapDetails } from '../components/swap-details/swap-details';
import { SwapFooterLayout } from '../components/swap-footer.layout';
import { SwapStatus } from '../components/swap-status/swap-status';
import { useAmountAsFiat } from '../hooks/use-amount-as-fiat';
import { SwapFormValues } from '../hooks/use-swap';
import { SwapSummaryActionButton } from './swap-summary-action-button';
import { SwapSummaryTabs } from './swap-summary-tabs';
import { SwapSummaryLayout } from './swap-summary.layout';

// TODO: Pass/replace state with tx data where needed and handle click events
// Commented code left here to use with tx data
export function SwapSummary() {
  const { values } = useFormikContext<SwapFormValues>();
  const analytics = useAnalytics();
  const { onCopy } = useClipboard('');
  // const { handleOpenTxLink } = useExplorerLink();

  useRouteHeader(<ModalHeader defaultClose hideActions title="Submitted" />, true);

  const amountAsFiat = useAmountAsFiat(values.swapAmountTo, values.swapAssetTo?.balance);

  function onClickCopy() {
    onCopy();
    toast.success('ID copied!');
  }

  function onClickLink() {
    void analytics.track('view_swap_transaction_confirmation', {
      swapSymbolFrom: values.swapAssetFrom?.balance.symbol,
      swapSymbolTo: values.swapAssetTo?.balance.symbol,
    });
    // handleOpenTxLink(txLink);
  }

  if (isUndefined(values.swapAssetTo)) {
    logger.error('No asset selected for swap');
    return null;
  }

  return (
    <SwapSummaryLayout>
      <SwapContentLayout>
        <Box width="100px">
          <CheckCircleIcon />
        </Box>
        <Title fontSize={8} my="loose">
          All done
        </Title>
        <Title fontSize={4}>
          {values.swapAmountTo} {values.swapAssetTo.balance.symbol}
        </Title>
        <Text fontWeight={500} mb="loose">
          ~{amountAsFiat}
        </Text>
        <SwapAssetsPair />
        <SwapSummaryTabs details={<SwapDetails />} status={<SwapStatus />} />
      </SwapContentLayout>
      <SwapFooterLayout>
        <Stack isInline spacing="base" width="100%">
          <SwapSummaryActionButton
            icon={FiExternalLink}
            label="View details"
            onClick={onClickLink}
          />
          <SwapSummaryActionButton icon={FiCopy} label="Copy ID" onClick={onClickCopy} />
        </Stack>
      </SwapFooterLayout>
    </SwapSummaryLayout>
  );
}
