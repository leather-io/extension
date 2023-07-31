import toast from 'react-hot-toast';
import { FiCheck, FiCopy, FiExternalLink } from 'react-icons/fi';
import { useLocation } from 'react-router-dom';

import { Flex, Stack, useClipboard } from '@stacks/ui';

import { useAnalytics } from '@app/common/hooks/analytics/use-analytics';
import { useExplorerLink } from '@app/common/hooks/use-explorer-link';
import {
  InfoCard,
  InfoCardAssetValue,
  InfoCardBtn,
  InfoCardFooter,
  InfoCardRow,
} from '@app/components/info-card/info-card';

export function RpcSignPsbtSummary() {
  const { state } = useLocation();
  const { handleOpenTxLink } = useExplorerLink();
  const analytics = useAnalytics();

  const { fee, sendingValue, totalSpend, txId, txFiatValue, txFiatValueSymbol, txLink, txValue } =
    state;

  const { onCopy } = useClipboard(txId);

  // TODO: Force close window?
  // useOnMount(() => {
  //   setTimeout(() => window.close(), timeOut);
  // });

  function onClickLink() {
    void analytics.track('view_rpc_sign_and_broadcast_psbt_confirmation', { symbol: 'BTC' });
    handleOpenTxLink(txLink);
  }

  function onClickCopy() {
    onCopy();
    toast.success('ID copied!');
  }

  return (
    <Flex alignItems="center" flexDirection="column" p="loose" width="100%">
      <InfoCard>
        <InfoCardAssetValue
          value={txValue}
          fiatValue={txFiatValue}
          fiatSymbol={txFiatValueSymbol}
          icon={FiCheck}
          mb="loose"
        />
        <Stack pb="extra-loose" width="100%">
          <InfoCardRow title="Total spend" value={totalSpend} />
          <InfoCardRow title="Sending" value={sendingValue} />
          <InfoCardRow title="Fee" value={fee} />
        </Stack>
        <InfoCardFooter>
          <Stack isInline spacing="base" width="100%">
            <InfoCardBtn icon={FiExternalLink} label="View Details" onClick={onClickLink} />
            <InfoCardBtn icon={FiCopy} label="Copy ID" onClick={onClickCopy} />
          </Stack>
        </InfoCardFooter>
      </InfoCard>
    </Flex>
  );
}
