import { useLocation } from 'react-router-dom';

import { Flex, HStack, Stack } from 'leather-styles/jsx';

import { CheckmarkIcon, CopyIcon, ExternalLinkIcon } from '@leather.io/ui';

import { analytics } from '@shared/utils/analytics';

import { useBitcoinExplorerLink } from '@app/common/hooks/use-bitcoin-explorer-link';
import { useClipboard } from '@app/common/hooks/use-copy-to-clipboard';
import {
  InfoCardAssetValue,
  InfoCardBtn,
  InfoCardFooter,
  InfoCardRow,
} from '@app/components/info-card/info-card';
import { Card } from '@app/components/layout';
import { useToast } from '@app/features/toasts/use-toast';

export function RpcSignPsbtSummary() {
  const { state } = useLocation();
  const { handleOpenBitcoinTxLink: handleOpenTxLink } = useBitcoinExplorerLink();

  const toast = useToast();

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
      <Card>
        <InfoCardAssetValue
          fiatSymbol={txFiatValueSymbol}
          fiatValue={txFiatValue}
          icon={<CheckmarkIcon height={36} width={36} />}
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
              icon={<ExternalLinkIcon color="ink.background-primary" />}
              label="View details"
              onClick={onClickLink}
            />
            <InfoCardBtn
              icon={<CopyIcon color="ink.background-primary" />}
              label="Copy ID"
              onClick={onClickCopy}
            />
          </HStack>
        </InfoCardFooter>
      </Card>
    </Flex>
  );
}
