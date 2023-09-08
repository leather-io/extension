import { AddressTransactionWithTransfers } from '@stacks/stacks-blockchain-api-types';
import { BoxProps } from 'leather-styles/jsx';

import { FtTransferItem } from './ft-transfer-item';
import { StxTransferItem } from './stx-transfer-item';

interface TransactionTransfersProps extends BoxProps {
  transaction: AddressTransactionWithTransfers;
}
export function TransactionTransfers({ transaction, ...rest }: TransactionTransfersProps) {
  return (
    <>
      {transaction.stx_transfers.map((stxTransfer, index) => (
        <StxTransferItem stxTransfer={stxTransfer} parentTx={transaction} {...rest} key={index} />
      ))}
      {transaction.ft_transfers
        ? transaction.ft_transfers.map((ftTransfer, index) => (
            <FtTransferItem ftTransfer={ftTransfer} parentTx={transaction} {...rest} key={index} />
          ))
        : null}
    </>
  );
}
