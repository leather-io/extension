import { useMemo } from 'react';

import { BoxProps } from '@stacks/ui';

import { BitcoinTransaction } from '@shared/models/transactions/bitcoin-transaction.model';

import { useAnalytics } from '@app/common/hooks/analytics/use-analytics';
import { useExplorerLink } from '@app/common/hooks/use-explorer-link';
import { TransactionTitle } from '@app/components/transaction/transaction-title';
import { useCurrentBtcNativeSegwitAccountAddressIndexZero } from '@app/store/accounts/blockchain/bitcoin/native-segwit-account.hooks';

import { BitcoinTransactionCaption } from './bitcoin-transaction-caption';
import { BitcoinTransactionIcon } from './bitcoin-transaction-icon';
import { BitcoinTransactionItemLayout } from './bitcoin-transaction-item.layout';
import { BitcoinTransactionStatus } from './bitcoin-transaction-status';
import { BitcoinTransactionValue } from './bitcoin-transaction-value';
import { getBitcoinTxCaption, getBitcoinTxValue } from './bitcoin-transaction.utils';

interface BitcoinTransactionItemProps extends BoxProps {
  transaction?: BitcoinTransaction;
}
export function BitcoinTransactionItem({ transaction, ...rest }: BitcoinTransactionItemProps) {
  const bitcoinAddress = useCurrentBtcNativeSegwitAccountAddressIndexZero();
  const { handleOpenTxLink } = useExplorerLink();
  const analytics = useAnalytics();
  const caption = useMemo(() => getBitcoinTxCaption(transaction), [transaction]);
  const value = useMemo(
    () => getBitcoinTxValue(bitcoinAddress, transaction),
    [bitcoinAddress, transaction]
  );

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
      txIcon={<BitcoinTransactionIcon transaction={transaction} />}
      txStatus={<BitcoinTransactionStatus transaction={transaction} />}
      txTitle={<TransactionTitle title="Bitcoin" />}
      txValue={txValue}
      {...rest}
    />
  );
}
