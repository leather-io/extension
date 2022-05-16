import {
  FiArrowDown as IconArrowDown,
  FiArrowUp as IconArrowUp,
  FiCode as IconCode,
  FiPlus as IconPlus,
} from 'react-icons/fi';
import FunctionIcon from 'mdi-react/FunctionIcon';
import { BoxProps, color, ColorsStringLiteral } from '@stacks/ui';

import { Status, statusFromTx, Tx } from '@app/common/api/transactions';
import { useWallet } from '@app/common/hooks/use-wallet';
import { MicroblockIcon } from '@app/components/icons/microblock';

import { TransactionTypeIconWrapper } from './transaction-type-icon-wrapper';

type StatusColorMap = Record<Status, ColorsStringLiteral>;

const colorFromTx = (tx: Tx): ColorsStringLiteral => {
  const colorMap: StatusColorMap = {
    pending: 'feedback-alert',
    success_microblock: 'brand',
    success_anchor_block: 'brand',
    failed: 'feedback-error',
  };

  return colorMap[statusFromTx(tx)] ?? 'feedback-error';
};

const IconForTx = (tx: Tx, currentAccountStxAddress: string | undefined) => {
  const isSent = tx.sender_address === currentAccountStxAddress;

  const tokenTransferIcon = (tx: Tx) => {
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
  transaction: Tx;
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
