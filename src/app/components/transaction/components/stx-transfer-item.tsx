import { FiArrowDown, FiArrowUp } from 'react-icons/fi';
import type { AddressTransactionWithTransfers } from '@stacks/stacks-blockchain-api-types';

import { stacksValue } from '@app/common/stacks-utils';
import { useCurrentAccount } from '@app/store/accounts/account.hooks';
import { getTxCaption, StxTransfer } from '@app/common/transactions/transaction-utils';

import { TxTransferIconWrapper } from './tx-transfer-icon-wrapper';
import { TxTransferDetails } from './transaction-transfers';
import { TransactionItem } from './transaction-item';

interface StxTransferItemProps {
  stxTransfer: StxTransfer;
  parentTx: AddressTransactionWithTransfers;
}
export const StxTransferItem = ({ stxTransfer, parentTx }: StxTransferItemProps) => {
  const currentAccount = useCurrentAccount();
  const isOriginator = stxTransfer.sender === currentAccount?.address;

  const caption = getTxCaption(parentTx.tx) ?? '';
  const icon = isOriginator ? FiArrowUp : FiArrowDown;
  const title = 'Stacks Token Transfer';
  const value = `${isOriginator ? '-' : ''}${stacksValue({
    value: stxTransfer.amount,
    withTicker: false,
  })}`;

  const transferDetails: TxTransferDetails = {
    caption,
    icon: <TxTransferIconWrapper icon={icon} />,
    link: parentTx.tx.tx_id,
    title,
    value,
  };

  return <TransactionItem transferDetails={transferDetails} />;
};
