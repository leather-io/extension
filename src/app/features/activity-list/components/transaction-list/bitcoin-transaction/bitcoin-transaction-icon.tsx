import { FiArrowDown as IconArrowDown, FiArrowUp as IconArrowUp } from 'react-icons/fi';

import { Box, BoxProps, Circle, ColorsStringLiteral, Flex, color } from '@stacks/ui';

import { BitcoinTransaction } from '@shared/models/transactions/bitcoin-transaction.model';

import { BtcIcon } from '@app/components/icons/btc-icon';

import { isBitcoinTxInbound } from './bitcoin-transaction.utils';

interface TransactionIconProps extends BoxProps {
  transaction: BitcoinTransaction;
  btcAddress: string;
}

type BtcTxStatus = 'pending' | 'success';
type BtcStatusColorMap = Record<BtcTxStatus, ColorsStringLiteral>;

const statusFromTx = (tx: BitcoinTransaction): BtcTxStatus => {
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

function IconForTx(address: string, tx: BitcoinTransaction) {
  if (isBitcoinTxInbound(address, tx)) return IconArrowDown;
  return IconArrowUp;
}
export function BitcoinTransactionIcon({ transaction, btcAddress, ...rest }: TransactionIconProps) {
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
        <Box size="13px" as={IconForTx(btcAddress, transaction)} />
      </Circle>
    </Flex>
  );
}
