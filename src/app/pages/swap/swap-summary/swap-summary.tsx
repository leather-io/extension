import toast from 'react-hot-toast';
import { Outlet } from 'react-router-dom';

import WaxSeal from '@assets/illustrations/wax-seal.png';
// #4164 FIXME migrate useClipboard
import { useClipboard } from '@stacks/ui';
import { useFormikContext } from 'formik';
import { HStack, styled } from 'leather-styles/jsx';

import { logger } from '@shared/logger';
import { isUndefined } from '@shared/utils';

import { useAnalytics } from '@app/common/hooks/analytics/use-analytics';
import { useRouteHeader } from '@app/common/hooks/use-route-header';
import { CopyIcon } from '@app/components/icons/copy-icon';
import { ExternalLinkIcon } from '@app/components/icons/external-link-icon';
import { ModalHeader } from '@app/components/modal-header';

import { SwapAssetsPair } from '../components/swap-assets-pair/swap-assets-pair';
import { SwapContentLayout } from '../components/swap-content.layout';
import { SwapFooterLayout } from '../components/swap-footer.layout';
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
        <styled.img src={WaxSeal} width="208px" height="181px" alt="All done" mt="space.07" />
        <styled.h1 my="space.05" textStyle="heading.02">
          All done
        </styled.h1>
        <styled.h2 mb="space.01" textStyle="heading.03">
          {values.swapAmountTo} {values.swapAssetTo.balance.symbol}
        </styled.h2>
        <styled.span mb="space.05" textStyle="label.01">
          {amountAsFiat ? `~ ${amountAsFiat}` : '~ 0'}
        </styled.span>
        <SwapAssetsPair />
        <SwapSummaryTabs>
          <Outlet />
        </SwapSummaryTabs>
      </SwapContentLayout>
      <SwapFooterLayout>
        <HStack gap="space.04" width="100%">
          <SwapSummaryActionButton
            icon={<ExternalLinkIcon />}
            label="View details"
            onClick={onClickLink}
          />
          <SwapSummaryActionButton icon={<CopyIcon />} label="Copy ID" onClick={onClickCopy} />
        </HStack>
      </SwapFooterLayout>
    </SwapSummaryLayout>
  );
}
