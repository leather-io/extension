import type { AddressTransactionWithTransfers } from '@stacks/stacks-blockchain-api-types';

import type { StxTransfer } from '@leather-wallet/models';

import { stacksValue } from '@app/common/stacks-utils';
import { getTxCaption } from '@app/common/transactions/stacks/transaction.utils';
import { StacksTransactionItem } from '@app/components/stacks-transaction-item/stacks-transaction-item';
import { useCurrentStacksAccount } from '@app/store/accounts/blockchain/stacks/stacks-account.hooks';
import { ArrowDownIcon } from '@app/ui/icons/arrow-down-icon';
import { ArrowUpIcon } from '@app/ui/icons/arrow-up-icon';

import { TxTransferIconWrapper } from './tx-transfer-icon-wrapper';

interface StxTransferItemProps {
  stxTransfer: StxTransfer;
  parentTx: AddressTransactionWithTransfers;
}
export function StxTransferItem({ stxTransfer, parentTx }: StxTransferItemProps) {
  const currentAccount = useCurrentStacksAccount();
  const isOriginator = stxTransfer.sender === currentAccount?.address;

  const caption = getTxCaption(parentTx.tx) ?? '';
  const icon = isOriginator ? <ArrowUpIcon variant="small" /> : <ArrowDownIcon variant="small" />;
  const title = 'Stacks Token Transfer';
  const value = `${isOriginator ? '-' : ''}${stacksValue({
    value: stxTransfer.amount,
    withTicker: false,
  })}`;

  return (
    <StacksTransactionItem
      caption={caption}
      icon={<TxTransferIconWrapper icon={icon} />}
      link={parentTx.tx.tx_id}
      title={title}
      value={value}
    />
  );
}
