import { StacksTx } from '@shared/models/transactions/stacks-transaction.model';

import { CodeIcon } from '@app/ui/components/icons/code-icon';
import { FunctionIcon } from '@app/ui/components/icons/function-icon';
import { PlusIcon } from '@app/ui/components/icons/plus-icon';

import { TokenTransferIcon } from './token-transfer-icon';

export function TransactionIcon(props: { tx: StacksTx }) {
  const { tx } = props;

  switch (tx.tx_type) {
    case 'coinbase':
      return <PlusIcon size="xs" />;
    case 'smart_contract':
      return <CodeIcon size="xs" />;
    case 'token_transfer':
      return <TokenTransferIcon tx={tx} />;
    case 'contract_call':
      return <FunctionIcon />;
    case 'poison_microblock':
      return null;
    default:
      return null;
  }
}
