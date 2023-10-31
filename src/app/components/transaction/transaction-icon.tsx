import { token } from 'leather-styles/tokens';
import FunctionIcon from 'mdi-react/FunctionIcon';

import { StacksTx } from '@shared/models/transactions/stacks-transaction.model';

import { CodeIcon } from '@app/ui/components/icons/code-icon';
import { PlusIcon } from '@app/ui/components/icons/plus-icon';

import { TokenTransferIcon } from './token-transfer-icon';

export function TransactionIcon(props: { tx: StacksTx }) {
  const { tx } = props;

  switch (tx.tx_type) {
    case 'coinbase':
      return <PlusIcon size={token('icons.icon.xs')} />;
    case 'smart_contract':
      return <CodeIcon size={token('icons.icon.xs')} />;
    case 'token_transfer':
      return <TokenTransferIcon tx={tx} />;
    case 'contract_call':
      return <FunctionIcon size={token('icons.icon.xs')} />;
    case 'poison_microblock':
      return null;
    default:
      return null;
  }
}
