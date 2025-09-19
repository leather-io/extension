import { Navigate, useParams } from 'react-router';

import { type IntCV, deserializeTransaction } from '@stacks/transactions';
import z from 'zod';

import { baseCurrencyAmountInQuote, createMoney, microStxToStx } from '@leather.io/utils';

import { formatCurrency } from '@app/common/currency-formatter';
import {
  getRecipientFromStacksTransaction,
  isSip10Transfer,
} from '@app/common/transactions/stacks/transaction.utils';
import { useCryptoCurrencyMarketDataMeanAverage } from '@app/query/common/market-data/market-data.hooks';
import { useGetRawTransactionByIdQuery } from '@app/query/stacks/transactions/raw-transaction-by-id.query';
import { useGetTransactionByIdQuery } from '@app/query/stacks/transactions/transactions-by-id.query';

import { StacksChainTxSummaryLayout } from './stacks-chain-tx-summary';

const paramsSchema = z.object({ symbol: z.string(), txid: z.string() });
type RouteParams = z.infer<typeof paramsSchema>;

export function StacksChainTxSummaryRoute() {
  const { data: params } = paramsSchema.safeParse(useParams());
  if (!params) return <Navigate to="/" replace />;

  if (params.symbol.toUpperCase() === 'STX') return <StxSentSummary {...params} />;

  return <Sip10SentSummary {...params} />;
}

export function StxSentSummary({ txid }: RouteParams) {
  const tokenMarketData = useCryptoCurrencyMarketDataMeanAverage('STX');
  const { data: transaction } = useGetTransactionByIdQuery(txid);
  const { data: rawTransaction } = useGetRawTransactionByIdQuery(txid);

  if (!transaction || !rawTransaction) return 'loading...';

  if (transaction.tx_type !== 'token_transfer')
    throw new Error('Impossible state, STX transfers are always of type `token_transfer`');

  console.log({ transaction, rawTransaction });

  const decodedTx = deserializeTransaction(rawTransaction.raw_tx);
  console.log({ decodedTx });

  const stacksOnlyFiatValue = {
    fiatValue: formatCurrency(
      baseCurrencyAmountInQuote(
        createMoney(Number(transaction.token_transfer.amount), 'STX'),
        tokenMarketData
      )
    ),
    fiatSymbol: tokenMarketData.price.symbol,
  };

  const fee = createMoney(Number(decodedTx.auth.spendingCondition.fee), 'STX');

  return (
    <StacksChainTxSummaryLayout
      value={microStxToStx(Number(transaction.token_transfer.amount)).toNumber()}
      txFiatValue={stacksOnlyFiatValue.fiatValue}
      recipient={transaction.token_transfer.recipient_address}
      token="STX"
      txid={txid}
      metadata={[
        ['Total spend', '100stx'],
        ['Sending', 'lksjdfs'],
        ['Fee', formatCurrency(fee)],
      ]}
    />
  );
}

export function Sip10SentSummary({ txid, symbol }: RouteParams) {
  const { data: transaction } = useGetTransactionByIdQuery(txid);
  const { data: rawTransaction } = useGetRawTransactionByIdQuery(txid);

  if (!transaction || !rawTransaction) return 'loading...';

  console.log({ transaction, rawTransaction });

  const decodedTx = deserializeTransaction(rawTransaction.raw_tx);
  console.log({ decodedTx });

  const amountAsMoney = (() => {
    if (isSip10Transfer(decodedTx)) {
      return Number((decodedTx.payload.functionArgs?.[0] as IntCV).value);
    }
    return 0;
  })();

  const recipient = getRecipientFromStacksTransaction(transaction) ?? undefined;
  const fee = createMoney(Number(decodedTx.auth.spendingCondition.fee), 'STX');

  return (
    <StacksChainTxSummaryLayout
      token={symbol}
      txid={txid}
      value={amountAsMoney}
      recipient={recipient}
      metadata={[
        ['Total spend', '100stx'],
        ['Sending', 'lksjdfs'],
        ['Fee', formatCurrency(fee)],
      ]}
    />
  );
}
