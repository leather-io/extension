import { useMatch, useNavigate } from 'react-router-dom';

import { StacksTx } from '@leather.io/models';

import { RouteUrls } from '@shared/route-urls';
import { analytics } from '@shared/utils/analytics';

import { useStacksExplorerLink } from '@app/common/hooks/use-stacks-explorer-link';
import {
  StacksTransactionActionType,
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
import { useIsPrivateMode } from '@app/store/settings/settings.selectors';

import { TransactionItemLayout } from '../transaction-item/transaction-item.layout';
import { StacksTransactionActionMenu } from './stacks-transaction-action-menu';
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
  const isPrivate = useIsPrivateMode();

  const navigate = useNavigate();
  const { whenWallet } = useWalletType();

  const cancelTransactionMatch = useMatch(RouteUrls.CancelStacksTransaction);
  const increaseFeeMatch = useMatch(RouteUrls.IncreaseStacksFee);

  const hasTransferDetailsData = !!caption && !!title && !!value && !!link;

  if (!transaction && !hasTransferDetailsData) return null;

  const openTxLink = () => {
    void analytics.track('view_transaction');
    handleOpenStacksTxLink({
      txid: transaction?.tx_id || link || '',
    });
  };

  const isOriginator = transaction?.sender_address === currentAccount?.address;
  const isPending = transaction && isPendingTx(transaction);

  const txCaption = transaction ? getTxCaption(transaction) : caption || '';
  const txIcon = transaction ? <StacksTransactionIcon transaction={transaction} /> : icon;
  const txTitle = transaction ? getTxTitle(transaction) : title || '';
  const txValue = transaction ? getTxValue(transaction, isOriginator) : value;

  function handleTransactionAction(action: StacksTransactionActionType) {
    if (!transaction) return;

    const routeUrl =
      action === StacksTransactionActionType.IncreaseFee
        ? RouteUrls.IncreaseStacksFee.replace(':txid', transaction.tx_id)
        : RouteUrls.CancelStacksTransaction.replace(':txid', transaction.tx_id);

    whenWallet({
      ledger: () =>
        whenPageMode({
          full: () => navigate(routeUrl),
          popup: () => openIndexPageInNewTab(routeUrl),
        })(),
      software: () => navigate(routeUrl),
    })();
  }

  const isTransactionActionRoute = !!cancelTransactionMatch || !!increaseFeeMatch;

  const txStatus = transaction && <StacksTransactionStatus transaction={transaction} />;

  const rightElement =
    isOriginator && isPending && !isTransactionActionRoute ? (
      <StacksTransactionActionMenu
        onIncreaseFee={() => handleTransactionAction(StacksTransactionActionType.IncreaseFee)}
        onCancelTransaction={() => handleTransactionAction(StacksTransactionActionType.Cancel)}
      />
    ) : undefined;

  return (
    <TransactionItemLayout
      openTxLink={openTxLink}
      rightElement={rightElement}
      txCaption={txCaption}
      txIcon={txIcon}
      txStatus={txStatus}
      txTitle={<TransactionTitle title={txTitle} />}
      txValue={txValue}
      isPrivate={isPrivate}
    />
  );
}
