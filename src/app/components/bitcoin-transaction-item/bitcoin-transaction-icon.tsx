import { Box, BoxProps, Circle, Flex, color } from '@stacks/ui';

import { BitcoinTx } from '@shared/models/transactions/bitcoin-transaction.model';

import { BtcIcon } from '@app/components/icons/btc-icon';

import { IconForTx, colorFromTx } from './utils';

interface TransactionIconProps extends BoxProps {
  transaction: BitcoinTx;
  btcAddress: string;
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
