import { useLocation, useNavigate } from 'react-router-dom';

import { StacksTx } from '@leather.io/models';

import { RouteUrls } from '@shared/route-urls';
import { analytics } from '@shared/utils/analytics';

import { useStacksExplorerLink } from '@app/common/hooks/use-stacks-explorer-link';
import {
  getTxCaption,
  getTxTitle,
  getTxValue,
  isPendingTx,
} from '@app/common/transactions/stacks/transaction.utils';
import { useWalletType } from '@app/common/use-wallet-type';
import { whenPageMode } from '@app/common/utils';
import { openIndexPageInNewTab } from '@app/common/utils/open-in-new-tab';
import { TransactionTitle } from '@app/components/transaction/transaction-title';
import { useCurrentStacksAccount } from '@app/store/accounts/blockchain/stacks/stacks-account.hooks';

import { TransactionItemLayout } from '../transaction-item/transaction-item.layout';
import { IncreaseFeeButton } from './increase-fee-button';
import { StacksTransactionIcon } from './stacks-transaction-icon';
import { StacksTransactionStatus } from './stacks-transaction-status';

interface StacksTransactionItemProps {
  caption?: string;
  icon?: React.JSX.Element;
  link?: string;
  title?: string;
  value?: string;
  transaction?: StacksTx;
}
export function StacksTransactionItem({
  caption,
  icon,
  link,
  title,
  value,
  transaction,
}: StacksTransactionItemProps) {
  const { handleOpenStacksTxLink } = useStacksExplorerLink();
  const currentAccount = useCurrentStacksAccount();

  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { whenWallet } = useWalletType();

  const hasTransferDetailsData = !!caption && !!title && !!value && !!link;
  if (!transaction && !hasTransferDetailsData) return null;

  const openTxLink = () => {
    void analytics.track('view_transaction');
    handleOpenStacksTxLink({
      txid: transaction?.tx_id || link || '',
    });
  };

  const onIncreaseFee = () => {
    if (!transaction) return;

    const routeUrl = RouteUrls.IncreaseStxFee.replace(':txid', transaction.tx_id);

    whenWallet({
      ledger: () =>
        whenPageMode({
          full: () => navigate(routeUrl),
          popup: () => openIndexPageInNewTab(routeUrl),
        })(),
      software: () => navigate(routeUrl),
    })();
  };

  const isOriginator = transaction?.sender_address === currentAccount?.address;
  const isPending = transaction && isPendingTx(transaction);

  const txCaption = transaction ? getTxCaption(transaction) : caption || '';
  const txIcon = transaction ? <StacksTransactionIcon transaction={transaction} /> : icon;
  const txTitle = transaction ? getTxTitle(transaction) : title || '';
  const txValue = transaction ? getTxValue(transaction, isOriginator) : value;
  const increaseFeeButton = (
    <IncreaseFeeButton
      isEnabled={isOriginator && isPending}
      isSelected={pathname === RouteUrls.IncreaseStxFee}
      onIncreaseFee={onIncreaseFee}
    />
  );
  const txStatus = transaction && <StacksTransactionStatus transaction={transaction} />;

  return (
    <TransactionItemLayout
      openTxLink={openTxLink}
      rightElement={isOriginator && isPending ? increaseFeeButton : undefined}
      txCaption={txCaption}
      txIcon={txIcon}
      txStatus={txStatus}
      txTitle={<TransactionTitle title={txTitle} />}
      txValue={txValue}
    />
  );
}
