import { token } from 'leather-styles/tokens';

import { StacksTx } from '@shared/models/transactions/stacks-transaction.model';

import { useCurrentAccountStxAddressState } from '@app/store/accounts/blockchain/stacks/stacks-account.hooks';
import { ArrowDownIcon } from '@app/ui/components/icons/arrow-down-icon';
import { ArrowUpIcon } from '@app/ui/components/icons/arrow-up-icon';
import { MicroblockIcon } from '@app/ui/components/icons/microblock-icon';

import { getColorFromTx } from './transaction-type-icon';

export function TokenTransferIcon(props: { tx: StacksTx }) {
  const { tx } = props;
  const currentAccountStxAddress = useCurrentAccountStxAddressState();
  const isSent = tx.sender_address === currentAccountStxAddress;

  if ('is_unanchored' in tx && tx.is_unanchored)
    return (
      <MicroblockIcon
        bg={getColorFromTx(tx)}
        borderColor="currentColor"
        fill="accent.background-primary"
        size={token('icons.icon.xs')}
      />
    );

  if (isSent) return <ArrowUpIcon size={token('icons.icon.xs')} />;

  return <ArrowDownIcon size={token('icons.icon.xs')} />;
}
