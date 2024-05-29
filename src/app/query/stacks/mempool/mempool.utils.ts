import { createMoney, sumNumbers } from '@leather-wallet/utils';
import type {
  MempoolTokenTransferTransaction,
  MempoolTransaction,
  Transaction,
} from '@stacks/stacks-blockchain-api-types';

type PendingTransactionType = 'inbound' | 'outbound';

function getInboundPendingTxs(
  address: string,
  confirmedTxs: Transaction[],
  pendingTxs: MempoolTransaction[]
) {
  return pendingTxs.filter(tx => {
    if (confirmedTxs.some(confirmedTx => confirmedTx.nonce === tx.nonce)) {
      return false;
    }
    return tx.tx_type === 'token_transfer' && tx.token_transfer.recipient_address === address;
  }) as unknown as MempoolTokenTransferTransaction[];
}

function getOutboundPendingTxs(
  address: string,
  confirmedTxs: Transaction[],
  pendingTxs: MempoolTransaction[]
) {
  return pendingTxs.filter(tx => {
    if (confirmedTxs.some(confirmedTx => confirmedTx.nonce === tx.nonce)) {
      return false;
    }
    return tx.tx_type === 'token_transfer' && tx.sender_address === address;
  }) as unknown as MempoolTokenTransferTransaction[];
}

interface CalculatePendingTxsMoneyBalanceArgs {
  address: string;
  confirmedTxs: Transaction[];
  pendingTxs: MempoolTransaction[];
  type: PendingTransactionType;
}
export function calculatePendingTxsMoneyBalance({
  address,
  confirmedTxs,
  pendingTxs,
  type,
}: CalculatePendingTxsMoneyBalanceArgs) {
  const filteredPendingTxs =
    type === 'inbound'
      ? getInboundPendingTxs(address, confirmedTxs, pendingTxs)
      : getOutboundPendingTxs(address, confirmedTxs, pendingTxs);

  const tokenTransferTxsBalance = sumNumbers(
    filteredPendingTxs.map(tx => Number(tx.token_transfer.amount))
  );
  const pendingTxsFeesBalance = sumNumbers(filteredPendingTxs.map(tx => Number(tx.fee_rate)));

  return createMoney(tokenTransferTxsBalance.plus(pendingTxsFeesBalance), 'STX');
}
