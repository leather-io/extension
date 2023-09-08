import {
  FiArrowDown as IconArrowDown,
  FiArrowUp as IconArrowUp,
  FiCode as IconCode,
  FiPlus as IconPlus,
} from 'react-icons/fi';
// #4164 FIXME migrate - ask design about this icon - do we have a new one
import { FiZap } from 'react-icons/fi';

// // #4164 FIXME migrate ColorsStringLiteral
import { ColorsStringLiteral } from '@stacks/ui';
import { BoxProps, styled } from 'leather-styles/jsx';
import { token } from 'leather-styles/tokens';
import FunctionIcon from 'mdi-react/FunctionIcon';

import { StacksTx, StacksTxStatus } from '@shared/models/transactions/stacks-transaction.model';

import { statusFromTx } from '@app/common/transactions/stacks/transaction.utils';
import { useCurrentAccountStxAddressState } from '@app/store/accounts/blockchain/stacks/stacks-account.hooks';

import { TransactionTypeIconWrapper } from './transaction-type-icon-wrapper';

type StatusColorMap = Record<StacksTxStatus, ColorsStringLiteral>;

// #4164 FIXME migrate color
const colorFromTx = (tx: StacksTx): ColorsStringLiteral => {
  const colorMap: StatusColorMap = {
    pending: 'feedback-alert',
    success_microblock: 'brand',
    success_anchor_block: 'brand',
    failed: 'feedback-error',
  };

  return colorMap[statusFromTx(tx)] ?? 'feedback-error';
};

function IconForTx(tx: StacksTx, currentAccountStxAddress: string | undefined) {
  const isSent = tx.sender_address === currentAccountStxAddress;

  const tokenTransferIcon = (tx: StacksTx) => {
    return 'is_unanchored' in tx && tx.is_unanchored
      ? () => (
          <styled.div
            // bg={color(colorFromTx(tx))} #4164 FIXME migrate colorFromTx
            bg={token('colors.accent.background-secondary')} // #4164 FIXME migrate color invert'
            borderColor={token('colors.accent.background-secondary')}
          >
            <FiZap width="13px" height="13px" fill={token('colors.accent.background-primary')} />
          </styled.div>
        )
      : isSent
      ? IconArrowUp
      : IconArrowDown;
  };

  const iconMap = {
    coinbase: IconPlus,
    smart_contract: IconCode,
    token_transfer: tokenTransferIcon(tx),
    contract_call: () => <FunctionIcon size="14px" />,
    poison_microblock: null,
  };
  return iconMap[tx.tx_type];
}

interface TransactionTypeIconProps extends BoxProps {
  transaction: StacksTx;
}
export function TransactionTypeIcon({ transaction, ...rest }: TransactionTypeIconProps) {
  const currentAccountStxAddress = useCurrentAccountStxAddressState();
  const Icon = IconForTx(transaction, currentAccountStxAddress);

  if (
    ['coinbase', 'smart_contract', 'token_transfer', 'contract_call'].includes(
      transaction.tx_type
    ) &&
    Icon
  ) {
    return <TransactionTypeIconWrapper icon={Icon} bg={colorFromTx(transaction)} {...rest} />;
  }
  return null;
}
