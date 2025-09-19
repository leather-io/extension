import { type StacksTransactionWire, isTokenTransferPayload } from '@stacks/transactions';
import { type UseQueryResult } from '@tanstack/react-query';

import { type FtAssetResponse } from '@leather.io/query';
import { baseCurrencyAmountInQuote, createMoney, sumMoney } from '@leather.io/utils';

import { formatCurrency } from '@app/common/currency-formatter';
import {
  getContractAddressFromContractCallPayload,
  getNonceFromStacksTransaction,
  getRecipientFromStacksTransaction,
  getSip10MemoDisplayText,
  getSip10TransferAmount,
  getStacksTransactionFee,
  getTokenTransferAmount,
  getTokenTransferMemoDisplayText,
  isSip10TransferContactCall,
  safeAddressToString,
} from '@app/common/transactions/stacks/transaction.utils';
import { TxStatusBadge } from '@app/features/tx-status-badge/tx-status-badge';
import { useCryptoCurrencyMarketDataMeanAverage } from '@app/query/common/market-data/market-data.hooks';
import { useGetFungibleTokenMetadataQuery } from '@app/query/stacks/token-metadata/fungible-tokens/fungible-token-metadata.query';

import {
  StacksChainTxSummaryLayout,
  StacksChainTxSummaryLoading,
} from './stacks-chain-tx-summary.layout';

interface StacksChainSummaryProps {
  txid: string;
  symbol: string;
  tx: StacksTransactionWire;
}
export function StxSentSummary({ txid, tx }: StacksChainSummaryProps) {
  const tokenMarketData = useCryptoCurrencyMarketDataMeanAverage('STX');

  if (!isTokenTransferPayload(tx.payload))
    throw new Error('Impossible state, STX transfers are always of type `token_transfer`');

  const amount = getTokenTransferAmount(tx.payload);
  const fiatAmount = baseCurrencyAmountInQuote(amount, tokenMarketData);
  const fee = getStacksTransactionFee(tx);
  const total = sumMoney([amount, fee]);
  const memo = getTokenTransferMemoDisplayText(tx.payload) || '—';

  return (
    <StacksChainTxSummaryLayout
      value={amount}
      txFiatValue={formatCurrency(fiatAmount)}
      recipient={safeAddressToString(tx.payload.recipient.value) ?? undefined}
      token="STX"
      txid={txid}
      metadata={[
        ['Status', <TxStatusBadge key={txid} txid={txid} />],
        ['Total spend', formatCurrency(total)],
        ['Sending', formatCurrency(createMoney(Number(tx.payload.amount), 'STX'))],
        ['Fee', formatCurrency(fee)],
        ['Memo', memo],
        ['Nonce', getNonceFromStacksTransaction(tx)],
      ]}
    />
  );
}

export function Sip10SentSummary({ txid, symbol, tx }: StacksChainSummaryProps) {
  if (!isSip10TransferContactCall(tx)) throw new Error('Impossible state, not a SIP-10 transfer');
  const contract = getContractAddressFromContractCallPayload(tx.payload);

  // Type casting because monorepo returns inaccurate type
  const { data: tokenMetadata } = useGetFungibleTokenMetadataQuery(
    contract
  ) as UseQueryResult<FtAssetResponse>;

  if (!tokenMetadata || !('decimals' in tokenMetadata))
    return <StacksChainTxSummaryLoading txid={txid} />;

  const amount = getSip10TransferAmount(tx.payload, symbol, tokenMetadata.decimals ?? 0);
  const recipient = getRecipientFromStacksTransaction(tx) ?? undefined;
  const fee = getStacksTransactionFee(tx);
  const memo = getSip10MemoDisplayText(tx.payload) || '—';

  return (
    <StacksChainTxSummaryLayout
      token={symbol}
      txid={txid}
      value={amount}
      recipient={recipient}
      metadata={[
        ['Status', <TxStatusBadge key={txid} txid={txid} />],
        ['Fee', formatCurrency(fee)],
        ['Memo', memo],
        ['Nonce', getNonceFromStacksTransaction(tx)],
      ]}
    />
  );
}
