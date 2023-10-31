import FunctionIcon from 'mdi-react/FunctionIcon';

import { StacksTx } from '@shared/models/transactions/stacks-transaction.model';

import { PlusIcon } from '@app/ui/components/icons/plus-icon';

import { CodeIcon } from '../icons/code-icon';
import { TokenTransferIcon } from './token-transfer-icon';

export function TransactionIcon(props: { tx: StacksTx }) {
  const { tx } = props;

  switch (tx.tx_type) {
    case 'coinbase':
      return <PlusIcon size="13px" />;
    case 'smart_contract':
      return <CodeIcon />;
    case 'token_transfer':
      return <TokenTransferIcon tx={tx} />;
    case 'contract_call':
      return <FunctionIcon size="13px" />;
    case 'poison_microblock':
      return null;
    default:
      return null;
  }
}
