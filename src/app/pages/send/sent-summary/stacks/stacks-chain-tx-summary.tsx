import type { ReactNode } from 'react';

import { SendCryptoAssetSelectors } from '@tests/selectors/send.selectors';
import { Stack } from 'leather-styles/jsx';

import { analytics } from '@shared/utils/analytics';

import { useClipboard } from '@app/common/hooks/use-copy-to-clipboard';
import { useStacksExplorerLink } from '@app/common/hooks/use-stacks-explorer-link';
import { FormAddressDisplayer } from '@app/components/address-displayer/form-address-displayer';
import {
  InfoCardAssetValue,
  InfoCardRow,
  InfoCardSeparator,
} from '@app/components/info-card/info-card';
import { Card, Content, Page, SummaryFooter } from '@app/components/layout';
import { PageHeader } from '@app/features/container/headers/page.header';
import { useToast } from '@app/features/toasts/use-toast';

import { TxDone } from '../../send-crypto-asset-form/components/tx-done';

interface StacksChainTxSummaryLayoutProps {
  txid: string;
  token: string;
  recipient?: string;
  value: number;
  txFiatValue?: string;
  metadata: [string, ReactNode][];
}
export function StacksChainTxSummaryLayout(props: StacksChainTxSummaryLayoutProps) {
  const { txid, token, recipient, value, txFiatValue, metadata } = props;

  const { onCopy } = useClipboard(txid);
  const { handleOpenStacksTxLink } = useStacksExplorerLink();
  const toast = useToast();

  function onClickLink() {
    void analytics.track('view_transaction_confirmation', { symbol: 'STX' });
    handleOpenStacksTxLink({ txid });
  }

  function onClickCopy() {
    toast.success('ID copied!');
    onCopy();
  }

  return (
    <>
      <PageHeader title="Sent" isSummaryPage />
      <Content>
        <Page>
          <Card
            data-testid={SendCryptoAssetSelectors.SentTransactionSummary}
            contentStyle={{ p: 'space.00' }}
            footer={<SummaryFooter onClickCopy={onClickCopy} onClickLink={onClickLink} />}
          >
            <TxDone />

            <InfoCardAssetValue
              fiatSymbol="USD"
              fiatValue={txFiatValue}
              px="space.05"
              symbol={token.toUpperCase()}
              value={value}
            />

            <Stack pb="space.06" px="space.06" width="100%">
              {recipient && (
                <>
                  <InfoCardRow title="To" value={<FormAddressDisplayer address={recipient} />} />
                  <InfoCardSeparator />
                </>
              )}

              {metadata.map(([title, value]) => (
                <InfoCardRow key={title} title={title} value={value} />
              ))}
            </Stack>
          </Card>
        </Page>
      </Content>
    </>
  );
}
