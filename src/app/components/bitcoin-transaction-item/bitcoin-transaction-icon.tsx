import { Circle, CircleProps, Flex } from 'leather-styles/jsx';

import { BitcoinTx } from '@shared/models/transactions/bitcoin-transaction.model';

import { getColorFromBitcoinTx, isBitcoinTxInbound } from '@app/common/transactions/bitcoin/utils';
import { BtcIcon } from '@app/ui/components/icons/btc-icon';

import { ArrowDownIcon } from '../icons/arrow-down-icon';
import { ArrowUpIcon } from '../icons/arrow-up-icon';

export function TxStatusIcon(props: { address: string; tx: BitcoinTx }) {
  const { address, tx } = props;
  if (isBitcoinTxInbound(address, tx)) return <ArrowDownIcon size="13px" />;
  return <ArrowUpIcon size="13px" />;
}

interface TransactionIconProps extends CircleProps {
  transaction: BitcoinTx;
  btcAddress: string;
}
export function BitcoinTransactionIcon({
  transaction,
  btcAddress,
  ...props
}: TransactionIconProps) {
  return (
    <Flex position="relative">
      <BtcIcon />
      <Circle
        bottom="-2px"
        right="-9px"
        position="absolute"
        size="21px"
        bg={getColorFromBitcoinTx(transaction)}
        color="accent.background-primary"
        border="background"
        {...props}
      >
        <TxStatusIcon address={btcAddress} tx={transaction} />
      </Circle>
    </Flex>
  );
}
