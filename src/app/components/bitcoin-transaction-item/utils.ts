import { FiArrowDown as IconArrowDown, FiArrowUp as IconArrowUp } from 'react-icons/fi';

import { ColorsStringLiteral } from '@stacks/ui-theme';

import { BitcoinTx } from '@shared/models/transactions/bitcoin-transaction.model';

import { isBitcoinTxInbound } from '@app/common/transactions/bitcoin/utils';

type BtcTxStatus = 'pending' | 'success';
type BtcStatusColorMap = Record<BtcTxStatus, ColorsStringLiteral>;

const statusFromTx = (tx: BitcoinTx): BtcTxStatus => {
  if (tx.status.confirmed) return 'success';
  return 'pending';
};

export const colorFromTx = (tx: BitcoinTx): ColorsStringLiteral => {
  const colorMap: BtcStatusColorMap = {
    pending: 'feedback-alert',
    success: 'brand',
  };

  return colorMap[statusFromTx(tx)] ?? 'feedback-error';
};

export function IconForTx(address: string, tx: BitcoinTx) {
  if (isBitcoinTxInbound(address, tx)) return IconArrowDown;
  return IconArrowUp;
}

export function containsTaprootInput(tx: BitcoinTx) {
  return tx.vin.some(input => input.prevout.scriptpubkey_type === 'v1_p2tr');
}
