import { Circle, CircleProps, Flex } from 'leather-styles/jsx';
import { token } from 'leather-styles/tokens';

import { BitcoinTx } from '@shared/models/transactions/bitcoin-transaction.model';

import { getColorFromBitcoinTx, isBitcoinTxInbound } from '@app/common/transactions/bitcoin/utils';
import { ArrowDownIcon } from '@app/ui/components/icons/arrow-down-icon';
import { ArrowUpIcon } from '@app/ui/components/icons/arrow-up-icon';
import { BtcIcon } from '@app/ui/components/icons/btc-icon';

export function TxStatusIcon(props: { address: string; tx: BitcoinTx }) {
  const { address, tx } = props;
  if (isBitcoinTxInbound(address, tx)) return <ArrowDownIcon size="xs" />;
  return <ArrowUpIcon size="xs" />;
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
