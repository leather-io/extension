import toast from 'react-hot-toast';
import { Outlet, useLocation } from 'react-router-dom';

import WaxSeal from '@assets/illustrations/wax-seal.png';
import { useClipboard } from '@stacks/ui';
import { HStack, styled } from 'leather-styles/jsx';
import get from 'lodash.get';

import { logger } from '@shared/logger';
import { isUndefined } from '@shared/utils';

import { useAnalytics } from '@app/common/hooks/analytics/use-analytics';
import { useExplorerLink } from '@app/common/hooks/use-explorer-link';
import { useRouteHeader } from '@app/common/hooks/use-route-header';
import { CopyIcon } from '@app/components/icons/copy-icon';
import { ExternalLinkIcon } from '@app/components/icons/external-link-icon';
import { ModalHeader } from '@app/components/modal-header';

import { SwapAssetsPair } from '../components/swap-assets-pair/swap-assets-pair';
import { SwapContentLayout } from '../components/swap-content.layout';
import { SwapFooterLayout } from '../components/swap-footer.layout';
import { useAmountAsFiat } from '../hooks/use-amount-as-fiat';
import { useSwapContext } from '../swap.context';
import { SwapSummaryActionButton } from './swap-summary-action-button';
import { SwapSummaryTabs } from './swap-summary-tabs';
import { SwapSummaryLayout } from './swap-summary.layout';

function useSwapSummaryState() {
  const location = useLocation();
  return {
    txId: get(location.state, 'txId') as string,
  };
}

export function SwapSummary() {
  const { swapSubmissionData } = useSwapContext();
  const { txId } = useSwapSummaryState();
  const analytics = useAnalytics();
  const { onCopy } = useClipboard('');
  const { handleOpenTxLink } = useExplorerLink();

  useRouteHeader(<ModalHeader defaultClose hideActions title="Submitted" />, true);

  const amountAsFiat = useAmountAsFiat(
    swapSubmissionData?.swapAssetTo?.balance,
    swapSubmissionData?.swapAmountTo
  );

  function onClickCopy() {
    onCopy();
    toast.success('ID copied!');
  }

  function onClickLink() {
    void analytics.track('view_swap_transaction_confirmation', {
      swapSymbolFrom: swapSubmissionData?.swapAssetFrom?.balance.symbol,
      swapSymbolTo: swapSubmissionData?.swapAssetTo?.balance.symbol,
    });
    handleOpenTxLink({
      blockchain: 'stacks',
      txId,
    });
  }

  if (isUndefined(swapSubmissionData?.swapAssetTo)) {
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
          {swapSubmissionData?.swapAmountTo} {swapSubmissionData?.swapAssetTo.balance.symbol}
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
