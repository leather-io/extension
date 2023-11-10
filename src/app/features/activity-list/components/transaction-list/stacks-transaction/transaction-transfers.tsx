import { AddressTransactionWithTransfers } from '@stacks/stacks-blockchain-api-types';

import { FtTransferItem } from './ft-transfer-item';
import { StxTransferItem } from './stx-transfer-item';

interface TransactionTransfersProps {
  transaction: AddressTransactionWithTransfers;
}
export function TransactionTransfers({ transaction }: TransactionTransfersProps) {
  return (
    <>
      {transaction.stx_transfers.map((stxTransfer, index) => (
        <StxTransferItem stxTransfer={stxTransfer} parentTx={transaction} key={index} />
      ))}
      {transaction.ft_transfers
        ? transaction.ft_transfers.map((ftTransfer, index) => (
            <FtTransferItem ftTransfer={ftTransfer} parentTx={transaction} key={index} />
          ))
        : null}
    </>
  );
}
