import { StacksTx } from '@shared/models/transactions/stacks-transaction.model';

import { useCurrentStacksAccountAddress } from '@app/store/accounts/blockchain/stacks/stacks-account.hooks';
import { ArrowDownIcon } from '@app/ui/icons/arrow-down-icon';
import { ArrowUpIcon } from '@app/ui/icons/arrow-up-icon';

export function TokenTransferIcon(props: { tx: StacksTx }) {
  const { tx } = props;
  const currentAccountStxAddress = useCurrentStacksAccountAddress();
  const isSent = tx.sender_address === currentAccountStxAddress;

  if (isSent) return <ArrowUpIcon variant="small" />;

  return <ArrowDownIcon variant="small" />;
}
