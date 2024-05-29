import { ArrowDownIcon, ArrowUpIcon } from '@leather-wallet/ui';

import { StacksTx } from '@shared/models/transactions/stacks-transaction.model';

import { useCurrentStacksAccountAddress } from '@app/store/accounts/blockchain/stacks/stacks-account.hooks';

export function TokenTransferIcon(props: { tx: StacksTx }) {
  const { tx } = props;
  const currentAccountStxAddress = useCurrentStacksAccountAddress();
  const isSent = tx.sender_address === currentAccountStxAddress;

  if (isSent) return <ArrowUpIcon variant="small" />;

  return <ArrowDownIcon variant="small" />;
}
