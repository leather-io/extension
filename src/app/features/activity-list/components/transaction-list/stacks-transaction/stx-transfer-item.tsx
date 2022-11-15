import { FiArrowDown, FiArrowUp } from 'react-icons/fi';

import type { AddressTransactionWithTransfers } from '@stacks/stacks-blockchain-api-types';

import {
  StxTransfer,
  TxTransferDetails,
} from '@shared/models/transactions/stacks-transaction.model';

import { stacksValue } from '@app/common/stacks-utils';
import { getTxCaption } from '@app/common/transactions/stacks/transaction.utils';
import { StacksTransactionItem } from '@app/components/stacks-transaction-item/stacks-transaction-item';
import { useCurrentAccount } from '@app/store/accounts/account.hooks';

import { TxTransferIconWrapper } from './tx-transfer-icon-wrapper';

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

  return <StacksTransactionItem transferDetails={transferDetails} />;
};
