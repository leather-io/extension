import { ArrowDownIcon, ArrowUpIcon } from '@leather-wallet/ui';
import { Circle, CircleProps, Flex } from 'leather-styles/jsx';

import { BitcoinTx } from '@shared/models/transactions/bitcoin-transaction.model';

import { isBitcoinTxInbound } from '@app/common/transactions/bitcoin/utils';

function TxStatusIcon(props: { address: string; tx: BitcoinTx }) {
  const { address, tx } = props;
  if (isBitcoinTxInbound(address, tx)) return <ArrowDownIcon variant="small" />;
  return <ArrowUpIcon variant="small" />;
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
        bg={transaction.status.confirmed ? 'stacks' : 'yellow.action-primary-default'}
        color="ink.background-primary"
        border="background"
        {...props}
      >
        <TxStatusIcon address={btcAddress} tx={transaction} />
      </Circle>
    </Flex>
  );
}
