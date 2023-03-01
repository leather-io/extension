import { FiArrowDown as IconArrowDown, FiArrowUp as IconArrowUp } from 'react-icons/fi';

import { Box, BoxProps, Circle, ColorsStringLiteral, Flex, color } from '@stacks/ui';

import { BitcoinTransaction } from '@shared/models/transactions/bitcoin-transaction.model';

import { BtcIcon } from '@app/components/icons/btc-icon';

interface TransactionIconProps extends BoxProps {
  transaction: BitcoinTransaction;
}
type BtcStatusColorMap = Record<string, ColorsStringLiteral>;

const statusFromTx = (tx: BitcoinTransaction): string => {
  if (tx.status.confirmed) return 'success';
  return 'pending';
};

const colorFromTx = (tx: BitcoinTransaction): ColorsStringLiteral => {
  const colorMap: BtcStatusColorMap = {
    pending: 'feedback-alert',
    success: 'brand',
  };

  return colorMap[statusFromTx(tx)] ?? 'feedback-error';
};

function IconForTx(tx: BitcoinTransaction) {
  if (tx.status.confirmed) return IconArrowDown;
  return IconArrowUp;
}
export function BitcoinTransactionIcon({ transaction, ...rest }: TransactionIconProps) {
  return (
    <Flex position="relative">
      <Box as={BtcIcon} />
      <Circle
        bottom="-2px"
        right="-9px"
        position="absolute"
        size="21px"
        bg={color(colorFromTx(transaction))}
        color={color('bg')}
        border="2px solid"
        borderColor={color('bg')}
        {...rest}
      >
        <Box size="13px" as={IconForTx(transaction)} />
      </Circle>
    </Flex>
  );
}
