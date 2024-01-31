import { StacksTx } from '@shared/models/transactions/stacks-transaction.model';

import { CodeIcon } from '@app/ui/icons/code-icon';
import { FunctionIcon } from '@app/ui/icons/function-icon';
import { PlusIcon } from '@app/ui/icons/plus-icon';

import { TokenTransferIcon } from './token-transfer-icon';

export function TransactionIcon(props: { tx: StacksTx }) {
  const { tx } = props;

  switch (tx.tx_type) {
    case 'coinbase':
      return <PlusIcon width="xs" />;
    case 'smart_contract':
      return <CodeIcon width="xs" />;
    case 'token_transfer':
      return <TokenTransferIcon tx={tx} />;
    case 'contract_call':
      return <FunctionIcon />;
    default:
      return null;
  }
}
