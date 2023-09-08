import toast from 'react-hot-toast';
import { FiCheck, FiCopy, FiExternalLink } from 'react-icons/fi';
import { useLocation } from 'react-router-dom';

// #4164 FIXME migrate useClipboard
import { useClipboard } from '@stacks/ui';
import { Flex, HStack, Stack } from 'leather-styles/jsx';

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
    <Flex alignItems="center" flexDirection="column" p="space.05" width="100%">
      <InfoCard>
        <InfoCardAssetValue
          value={txValue}
          fiatValue={txFiatValue}
          fiatSymbol={txFiatValueSymbol}
          icon={<FiCheck size="32px" />}
          mb="space.05"
        />
        <Stack pb="space.06" width="100%">
          <InfoCardRow title="Total spend" value={totalSpend} />
          <InfoCardRow title="Sending" value={sendingValue} />
          <InfoCardRow title="Fee" value={fee} />
        </Stack>
        <InfoCardFooter>
          <HStack gap="space.04" width="100%">
            <InfoCardBtn icon={<FiExternalLink />} label="View Details" onClick={onClickLink} />
            <InfoCardBtn icon={<FiCopy />} label="Copy ID" onClick={onClickCopy} />
          </HStack>
        </InfoCardFooter>
      </InfoCard>
    </Flex>
  );
}
