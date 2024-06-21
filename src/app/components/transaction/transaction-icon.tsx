import { StacksTx } from '@leather.io/models';
import { CodeIcon, FunctionIcon, PlusIcon } from '@leather.io/ui';

import { TokenTransferIcon } from './token-transfer-icon';

export function TransactionIcon(props: { tx: StacksTx }) {
  const { tx } = props;

  switch (tx.tx_type) {
    case 'coinbase':
      return <PlusIcon variant="small" />;
    case 'smart_contract':
      return <CodeIcon variant="small" />;
    case 'token_transfer':
      return <TokenTransferIcon tx={tx} />;
    case 'contract_call':
      return <FunctionIcon />;
    default:
      return null;
  }
}
