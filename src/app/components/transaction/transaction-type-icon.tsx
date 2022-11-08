import {
  FiArrowDown as IconArrowDown,
  FiArrowUp as IconArrowUp,
  FiCode as IconCode,
  FiPlus as IconPlus,
} from 'react-icons/fi';

import { BoxProps, ColorsStringLiteral, color } from '@stacks/ui';
import FunctionIcon from 'mdi-react/FunctionIcon';

import { StacksTx, StacksTxStatus } from '@shared/models/transactions/stacks-transaction.model';

import { useWallet } from '@app/common/hooks/use-wallet';
import { statusFromTx } from '@app/common/transactions/stacks/transaction.utils';
import { MicroblockIcon } from '@app/components/icons/microblock';

import { TransactionTypeIconWrapper } from './transaction-type-icon-wrapper';

type StatusColorMap = Record<StacksTxStatus, ColorsStringLiteral>;

const colorFromTx = (tx: StacksTx): ColorsStringLiteral => {
  const colorMap: StatusColorMap = {
    pending: 'feedback-alert',
    success_microblock: 'brand',
    success_anchor_block: 'brand',
    failed: 'feedback-error',
  };

  return colorMap[statusFromTx(tx)] ?? 'feedback-error';
};

const IconForTx = (tx: StacksTx, currentAccountStxAddress: string | undefined) => {
  const isSent = tx.sender_address === currentAccountStxAddress;

  const tokenTransferIcon = (tx: StacksTx) => {
    return 'is_unanchored' in tx && tx.is_unanchored
      ? () => (
          <MicroblockIcon
            size="13px"
            fill={color('bg')}
            borderColor={color('invert')}
            bg={color(colorFromTx(tx))}
          />
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
};

interface TransactionTypeIconProps extends BoxProps {
  transaction: StacksTx;
}
export function TransactionTypeIcon({ transaction, ...rest }: TransactionTypeIconProps) {
  const { currentAccountStxAddress } = useWallet();
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
