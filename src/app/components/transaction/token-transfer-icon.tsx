import { StacksTx } from '@shared/models/transactions/stacks-transaction.model';

import { useCurrentAccountStxAddressState } from '@app/store/accounts/blockchain/stacks/stacks-account.hooks';
import { ArrowDownIcon } from '@app/ui/components/icons/arrow-down-icon';
import { ArrowUpIcon } from '@app/ui/components/icons/arrow-up-icon';
import { ZapIcon } from '@app/ui/components/icons/zap-icon';

import { getColorFromTx } from './transaction-type-icon';

export function TokenTransferIcon(props: { tx: StacksTx }) {
  const { tx } = props;
  const currentAccountStxAddress = useCurrentAccountStxAddressState();
  const isSent = tx.sender_address === currentAccountStxAddress;

  if ('is_unanchored' in tx && tx.is_unanchored)
    return (
      <ZapIcon
        bg={getColorFromTx(tx)}
        borderColor="currentColor"
        fill="accent.background-primary"
        size="xs"
      />
    );

  if (isSent) return <ArrowUpIcon size="xs" />;

  return <ArrowDownIcon size="xs" />;
}
