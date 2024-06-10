import { Circle, CircleProps, Flex } from 'leather-styles/jsx';

import type { BitcoinTx } from '@leather-wallet/models';

import { isBitcoinTxInbound } from '@app/common/transactions/bitcoin/utils';
import { ArrowDownIcon } from '@app/ui/icons/arrow-down-icon';
import { ArrowUpIcon } from '@app/ui/icons/arrow-up-icon';

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
