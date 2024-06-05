import { useMatch, useNavigate } from 'react-router-dom';

import { HStack } from 'leather-styles/jsx';

import { StacksTx } from '@leather.io/models';
import { ChevronsRightIcon, CloseIcon } from '@leather.io/ui';

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
import { StacksTransactionIcon } from './stacks-transaction-icon';
import { StacksTransactionStatus } from './stacks-transaction-status';
import { TransactionActionButton } from './transaction-action-button';

type TransactionAction = 'increaseFee' | 'cancel';

interface ActionRouteMap {
  increaseFee: keyof typeof RouteUrls;
  cancel: keyof typeof RouteUrls;
}

const actionRouteMap: ActionRouteMap = {
  increaseFee: 'IncreaseStxFee',
  cancel: 'CancelStxTransaction',
};

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

  const navigate = useNavigate();
  const { whenWallet } = useWalletType();

  const cancelTransactionMatch = useMatch('/cancel-transaction/stx/:txid');
  const increaseFeeMatch = useMatch('/increase-fee/stx/:txid');
  const isTransactionActionRoute = !!cancelTransactionMatch || !!increaseFeeMatch;

  const hasTransferDetailsData = !!caption && !!title && !!value && !!link;
  if (!transaction && !hasTransferDetailsData) return null;

  const openTxLink = () => {
    void analytics.track('view_transaction');
    handleOpenStacksTxLink({
      txid: transaction?.tx_id || link || '',
    });
  };

  const handleTransactionAction = (action: TransactionAction): void => {
    if (!transaction) return;

    const routeKey = actionRouteMap[action];
    const routeUrl = RouteUrls[routeKey].replace(':txid', transaction.tx_id);

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

  const actionButtonGroup = (
    <HStack alignItems="start" gap="space.01">
      <TransactionActionButton
        key="Cancel"
        icon={<CloseIcon color="stacks" variant="small" height={12} />}
        maxWidth="110px"
        isEnabled={isOriginator && isPending}
        isSelected={isTransactionActionRoute}
        onButtonClick={() => handleTransactionAction('cancel')}
        label="Cancel"
      />
      <TransactionActionButton
        key="Increase Fee"
        icon={<ChevronsRightIcon color="stacks" variant="small" />}
        maxWidth="110px"
        isEnabled={isOriginator && isPending}
        isSelected={isTransactionActionRoute}
        onButtonClick={() => handleTransactionAction('increaseFee')}
        label="Speed Up"
      />
    </HStack>
  );

  const txIsPending = transaction && transaction.tx_status == 'pending';
  const txStatus = transaction && <StacksTransactionStatus transaction={transaction} />;

  return (
    <TransactionItemLayout
      openTxLink={openTxLink}
      rightElement={isOriginator && isPending ? actionButtonGroup : undefined}
      txCaption={txCaption}
      txIcon={txIcon}
      txStatus={!txIsPending && txStatus}
      txTitle={<TransactionTitle title={txTitle} />}
      txValue={txValue}
    />
  );
}
