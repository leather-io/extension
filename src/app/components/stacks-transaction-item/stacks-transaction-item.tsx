import { createSearchParams, useLocation, useNavigate } from 'react-router-dom';

import { HStack } from 'leather-styles/jsx';

import { StacksTx, TxTransferDetails } from '@shared/models/transactions/stacks-transaction.model';
import { RouteUrls } from '@shared/route-urls';

import { useAnalytics } from '@app/common/hooks/analytics/use-analytics';
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
import { useRawTxIdState } from '@app/store/transactions/raw.hooks';

import { TransactionItemLayout } from '../transaction-item/transaction-item.layout';
import { CancelTransactionButton } from './cancel-transaction-button';
import { IncreaseFeeButton } from './increase-fee-button';
import { StacksTransactionIcon } from './stacks-transaction-icon';
import { StacksTransactionStatus } from './stacks-transaction-status';

interface StacksTransactionItemProps {
  transferDetails?: TxTransferDetails;
  transaction?: StacksTx;
}
export function StacksTransactionItem({
  transferDetails,
  transaction,
}: StacksTransactionItemProps) {
  const { handleOpenStacksTxLink } = useStacksExplorerLink();
  const currentAccount = useCurrentStacksAccount();
  const analytics = useAnalytics();
  const [_, setRawTxId] = useRawTxIdState();
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { whenWallet } = useWalletType();

  if (!transaction && !transferDetails) return null;

  const openTxLink = () => {
    void analytics.track('view_transaction');
    handleOpenStacksTxLink({
      txid: transaction?.tx_id || transferDetails?.link || '',
    });
  };

  const onIncreaseFee = () => {
    if (!transaction) return;
    setRawTxId(transaction.tx_id);

    const urlSearchParams = `?${createSearchParams({ txId: transaction.tx_id })}`;

    whenWallet({
      ledger: () =>
        whenPageMode({
          full: () => navigate(RouteUrls.IncreaseStxFee),
          popup: () => openIndexPageInNewTab(RouteUrls.IncreaseStxFee, urlSearchParams),
        })(),
      software: () => navigate(RouteUrls.IncreaseStxFee),
    })();
  };

  const onCancelTransaction = () => {
    if (!transaction) return;
    setRawTxId(transaction.tx_id);

    const urlSearchParams = `?${createSearchParams({ txId: transaction.tx_id })}`;

    whenWallet({
      ledger: () =>
        whenPageMode({
          full: () => navigate(RouteUrls.CancelStxTransaction),
          popup: () => openIndexPageInNewTab(RouteUrls.CancelStxTransaction, urlSearchParams),
        })(),
      software: () => navigate(RouteUrls.CancelStxTransaction),
    })();
  };

  const isOriginator = transaction?.sender_address === currentAccount?.address;
  const isPending = transaction && isPendingTx(transaction);

  const caption = transaction ? getTxCaption(transaction) : transferDetails?.caption || '';
  const txIcon = transaction ? (
    <StacksTransactionIcon transaction={transaction} />
  ) : (
    transferDetails?.icon
  );
  const title = transaction ? getTxTitle(transaction) : transferDetails?.title || '';
  const value = transaction ? getTxValue(transaction, isOriginator) : transferDetails?.value;
  const actionButtonGroup = (
    <HStack alignItems="start" gap="space.01">
      <CancelTransactionButton
        isEnabled={isOriginator && isPending}
        isSelected={
          pathname === RouteUrls.CancelStxTransaction || pathname === RouteUrls.IncreaseStxFee
        }
        onCancelTransaction={onCancelTransaction}
      />
      <IncreaseFeeButton
        isEnabled={isOriginator && isPending}
        isSelected={
          pathname === RouteUrls.IncreaseStxFee || pathname === RouteUrls.CancelStxTransaction
        }
        onIncreaseFee={onIncreaseFee}
      />
    </HStack>
  );
  const txStatus = transaction && <StacksTransactionStatus transaction={transaction} />;

  return (
    <TransactionItemLayout
      openTxLink={openTxLink}
      actionButtonGroupElement={isOriginator && isPending ? actionButtonGroup : undefined}
      txCaption={caption}
      txIcon={txIcon}
      txStatus={txStatus}
      txTitle={<TransactionTitle title={title} />}
      txValue={value}
    />
  );
}
