import { useLocation, useNavigate } from 'react-router-dom';

import { Callout, ExternalLinkIcon, Link } from '@leather.io/ui';
import { createMoney, formatMoney } from '@leather.io/utils';
import { HStack, Stack, styled } from 'leather-styles/jsx';
import get from 'lodash.get';

import { HandleOpenStacksTxLinkArgs } from '@app/common/hooks/use-stacks-explorer-link';
import { openInNewTab } from '@app/common/utils/open-in-new-tab';
import {
  InfoCardAssetValue,
  InfoCardBtn,
  InfoCardRow,
  InfoCardSeparator,
} from '@app/components/info-card/info-card';
import { Footer } from '@app/features/container/containers/footers/footer';
import { Card } from '@app/ui/layout/card/card';
import { CardContent } from '@app/ui/layout/card/card-content';

import { TxDone } from '../send-crypto-asset-form/components/tx-done';

function useBrc20SentSummaryState() {
  const location = useLocation();
  return {
    serviceFee: get(location.state, 'serviceFee') as string,
    totalFee: get(location.state, 'totalFee') as string,
    recipient: get(location.state, 'recipient') as string,
    ticker: get(location.state, 'ticker') as string,
    amount: get(location.state, 'amount') as string,
    txId: get(location.state, 'txId') as string,
    txLink: get(location.state, 'txLink') as HandleOpenStacksTxLinkArgs,
    feeRowValue: get(location.state, 'feeRowValue') as string,
  };
}

export function Brc20SentSummary() {
  const { ticker, amount, serviceFee, totalFee, feeRowValue } = useBrc20SentSummaryState();
  const amountFormatted = formatMoney(createMoney(Number(amount), ticker, 0));
  const navigate = useNavigate();

  function onClickLink() {
    navigate('/');
  }

  return (
    <Card
      footer={
        <Footer variant="card">
          <HStack gap="space.04" width="100%">
            <InfoCardBtn
              icon={<ExternalLinkIcon />}
              label="Pending BRC-20 transfers"
              onClick={onClickLink}
            />
          </HStack>
        </Footer>
      }
    >
      <CardContent p="space.00">
        <TxDone />

        <InfoCardAssetValue px="space.05" symbol={ticker} value={Number(amount)} />

        <Stack px="space.06" pb="space.06" width="100%">
          <Callout variant="info" title="One more step is required to send tokens" mb="space.05">
            <Stack>
              <styled.span mb="space.02">
                You'll need to send the transfer inscription to your recipient of choice from the
                home screen once its status changes to "Ready to send"
              </styled.span>
              <Link
                width="fit-content"
                textStyle="body.02"
                onClick={() => {
                  openInNewTab('https://leather.gitbook.io/guides/bitcoin/sending-brc-20-tokens');
                }}
              >
                Learn more
              </Link>
            </Stack>
          </Callout>
          <InfoCardSeparator />

          <InfoCardRow title="Sending" value={amountFormatted} />
          <InfoCardRow title="Inscription service fee" value={serviceFee} />
          <InfoCardRow title="Payment transaction fee" value={feeRowValue} />

          <InfoCardSeparator />
          <InfoCardRow title="Total fee" value={totalFee} />
        </Stack>
      </CardContent>
    </Card>
  );
}
