import { CodeIcon, FunctionIcon, PlusIcon } from '@leather-wallet/ui';

import { StacksTx } from '@shared/models/transactions/stacks-transaction.model';

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
