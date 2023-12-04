import { Circle, CircleProps, Flex } from 'leather-styles/jsx';

import { BitcoinTx } from '@shared/models/transactions/bitcoin-transaction.model';

import { isBitcoinTxInbound } from '@app/common/transactions/bitcoin/utils';
import { ArrowDownIcon } from '@app/ui/components/icons/arrow-down-icon';
import { ArrowUpIcon } from '@app/ui/components/icons/arrow-up-icon';

function TxStatusIcon(props: { address: string; tx: BitcoinTx }) {
  const { address, tx } = props;
  if (isBitcoinTxInbound(address, tx)) return <ArrowDownIcon size="xs" />;
  return <ArrowUpIcon size="xs" />;
}

interface TransactionIconProps extends CircleProps {
  transaction: BitcoinTx;
  btcAddress: string;
  icon: React.ReactNode;
}
export function BitcoinTransactionIcon({
  transaction,
  btcAddress,
  icon,
  ...props
}: TransactionIconProps) {
  return (
    <Flex position="relative">
      {icon}
      <Circle
        bottom="-2px"
        right="-9px"
        position="absolute"
        size="21px"
        bg={transaction.status.confirmed ? 'stacks' : 'warning.label'}
        color="accent.background-primary"
        border="background"
        {...props}
      >
        <TxStatusIcon address={btcAddress} tx={transaction} />
      </Circle>
    </Flex>
  );
}
