import { useMemo } from 'react';

import { Box, BoxProps } from '@stacks/ui';

import { BITCOIN_TEST_ADDRESS } from '@shared/constants';
import { BitcoinTransaction } from '@shared/models/transactions/bitcoin-transaction.model';

import { useAnalytics } from '@app/common/hooks/analytics/use-analytics';
import { useExplorerLink } from '@app/common/hooks/use-explorer-link';
import { BtcIcon } from '@app/components/icons/btc-icon';
import { TransactionTitle } from '@app/components/transaction/transaction-title';

import { BitcoinTransactionCaption } from './bitcoin-transaction-caption';
import { BitcoinTransactionItemLayout } from './bitcoin-transaction-item.layout';
import { BitcoinTransactionStatus } from './bitcoin-transaction-status';
import { BitcoinTransactionValue } from './bitcoin-transaction-value';
import { getBitcoinTxCaption, getBitcoinTxValue } from './bitcoin-transaction.utils';

interface BitcoinTransactionItemProps extends BoxProps {
  transaction?: BitcoinTransaction;
}
export function BitcoinTransactionItem({ transaction, ...rest }: BitcoinTransactionItemProps) {
  const { handleOpenTxLink } = useExplorerLink();
  const analytics = useAnalytics();
  const caption = useMemo(() => getBitcoinTxCaption(transaction), [transaction]);
  const value = useMemo(() => getBitcoinTxValue(BITCOIN_TEST_ADDRESS, transaction), [transaction]);

  if (!transaction) return null;

  const openTxLink = () => {
    void analytics.track('view_bitcoin_transaction');
    handleOpenTxLink({
      blockchain: 'bitcoin',
      txid: transaction?.txid || '',
    });
  };

  const txCaption = <BitcoinTransactionCaption>{caption}</BitcoinTransactionCaption>;
  const txValue = <BitcoinTransactionValue>{value}</BitcoinTransactionValue>;

  return (
    <BitcoinTransactionItemLayout
      openTxLink={openTxLink}
      txCaption={txCaption}
      txIcon={<Box as={BtcIcon} />}
      txStatus={<BitcoinTransactionStatus transaction={transaction} />}
      txTitle={<TransactionTitle title="Bitcoin" />}
      txValue={txValue}
      {...rest}
    />
  );
}
