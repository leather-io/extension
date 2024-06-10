import { StacksTx } from '@leather-wallet/models';

import { CodeIcon } from '@app/ui/icons/code-icon';
import { FunctionIcon } from '@app/ui/icons/function-icon';
import { PlusIcon } from '@app/ui/icons/plus-icon';

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
