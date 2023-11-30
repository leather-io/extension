import toast from 'react-hot-toast';
import { useLocation } from 'react-router-dom';

import { Flex, HStack, Stack } from 'leather-styles/jsx';

import { useAnalytics } from '@app/common/hooks/analytics/use-analytics';
import { useBitcoinExplorerLink } from '@app/common/hooks/use-bitcoin-explorer-link';
import { useClipboard } from '@app/common/hooks/use-copy-to-clipboard';
import {
  InfoCard,
  InfoCardAssetValue,
  InfoCardBtn,
  InfoCardFooter,
  InfoCardRow,
} from '@app/components/info-card/info-card';
import { CheckmarkIcon } from '@app/ui/components/icons/checkmark-icon';
import { CopyIcon } from '@app/ui/components/icons/copy-icon';
import { ExternalLinkIcon } from '@app/ui/components/icons/external-link-icon';

export function RpcSignPsbtSummary() {
  const { state } = useLocation();
  const { handleOpenBitcoinTxLink: handleOpenTxLink } = useBitcoinExplorerLink();
  const analytics = useAnalytics();

  const { fee, sendingValue, totalSpend, txId, txFiatValue, txFiatValueSymbol, txLink, txValue } =
    state;

  const { onCopy } = useClipboard(txId);

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
          fiatSymbol={txFiatValueSymbol}
          fiatValue={txFiatValue}
          icon={<CheckmarkIcon size="32px" />}
          mb="space.05"
          value={txValue}
        />
        <Stack pb="space.06" width="100%">
          <InfoCardRow title="Total spend" value={totalSpend} />
          <InfoCardRow title="Sending" value={sendingValue} />
          <InfoCardRow title="Fee" value={fee} />
        </Stack>
        <InfoCardFooter>
          <HStack gap="space.04" width="100%">
            <InfoCardBtn
              icon={<ExternalLinkIcon size="14px" />}
              label="View details"
              onClick={onClickLink}
            />
            <InfoCardBtn icon={<CopyIcon size="14px" />} label="Copy ID" onClick={onClickCopy} />
          </HStack>
        </InfoCardFooter>
      </InfoCard>
    </Flex>
  );
}
