import { useLocation } from 'react-router-dom';

import { Stack } from 'leather-styles/jsx';

import { analytics } from '@shared/utils/analytics';

import { useBitcoinExplorerLink } from '@app/common/hooks/use-bitcoin-explorer-link';
import { useClipboard } from '@app/common/hooks/use-copy-to-clipboard';
import { FormAddressDisplayer } from '@app/components/address-displayer/form-address-displayer';
import {
  InfoCardAssetValue,
  InfoCardRow,
  InfoCardSeparator,
} from '@app/components/info-card/info-card';
import { Card, Content, Page, SummaryFooter } from '@app/components/layout';
import { PageHeader } from '@app/features/container/headers/page.header';
import { useToast } from '@app/features/toasts/use-toast';

import { TxDone } from '../send-crypto-asset-form/components/tx-done';

export function BtcSentSummary() {
  const { state } = useLocation();

  const toast = useToast();

  const {
    txId,
    txValue,
    txFiatValue,
    txFiatValueSymbol,
    symbol,
    txLink,
    arrivesIn,
    sendingValue,
    recipient,
    totalSpend,
    feeRowValue,
  } = state;

  const { onCopy } = useClipboard(txId);
  const { handleOpenBitcoinTxLink: handleOpenTxLink } = useBitcoinExplorerLink();

  function onClickLink() {
    void analytics.track('view_transaction_confirmation', { symbol: 'BTC' });
    handleOpenTxLink({ txid: txLink.txid });
  }

  function onClickCopy() {
    onCopy();
    toast.success('ID copied!');
  }

  return (
    <>
      <PageHeader title="Sent" isSummaryPage />
      <Content>
        <Page>
          <Card
            contentStyle={{
              p: 'space.00',
            }}
            footer={<SummaryFooter onClickCopy={onClickCopy} onClickLink={onClickLink} />}
          >
            <TxDone />
            <InfoCardAssetValue
              fiatSymbol={txFiatValueSymbol}
              fiatValue={txFiatValue}
              px="space.05"
              symbol={symbol}
              value={txValue}
            />

            <Stack pb="space.06" px="space.06" width="100%">
              <InfoCardRow title="To" value={<FormAddressDisplayer address={recipient} />} />
              <InfoCardSeparator />
              <InfoCardRow title="Total spend" value={totalSpend} />

              <InfoCardRow title="Sending" value={sendingValue} />
              <InfoCardRow title="Fee" value={feeRowValue} />
              {arrivesIn && <InfoCardRow title="Arrives in" value={arrivesIn} />}
            </Stack>
          </Card>
        </Page>
      </Content>
    </>
  );
}
