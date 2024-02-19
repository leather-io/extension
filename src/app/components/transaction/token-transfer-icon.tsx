import { StacksTx } from '@shared/models/transactions/stacks-transaction.model';

import { useCurrentAccountStxAddressState } from '@app/store/accounts/blockchain/stacks/stacks-account.hooks';
import { ArrowDownIcon } from '@app/ui/icons/arrow-down-icon';
import { ArrowUpIcon } from '@app/ui/icons/arrow-up-icon';

export function TokenTransferIcon(props: { tx: StacksTx }) {
  const { tx } = props;
  const currentAccountStxAddress = useCurrentAccountStxAddressState();
  const isSent = tx.sender_address === currentAccountStxAddress;

  if (isSent) return <ArrowUpIcon width="xs" />;

  return <ArrowDownIcon width="xs" />;
}
