import { Outlet } from 'react-router-dom';

import { Box } from 'leather-styles/jsx';

import type { Money } from '@leather.io/models';
import { Approver } from '@leather.io/ui';
import { baseCurrencyAmountInQuote, i18nFormatCurrency } from '@leather.io/utils';

import { closeWindow } from '@shared/utils';

import type { HasChildren } from '@app/common/has-children';
import { BackgroundOverlay } from '@app/components/loading-overlay';
import { getTransactionActions } from '@app/components/rpc-transaction-request/get-transaction-actions';
import { TransactionActionsTitle } from '@app/components/rpc-transaction-request/transaction-actions-title';
import { TransactionError } from '@app/components/rpc-transaction-request/transaction-error';
import { TransactionHeader } from '@app/components/rpc-transaction-request/transaction-header';
import { TransactionWrapper } from '@app/components/rpc-transaction-request/transaction-wrapper';
import { useFeeEditorContext } from '@app/features/fee-editor/fee-editor.context';
import { useRpcTransactionRequestContext } from '@app/features/rpc-transaction-request/rpc-transaction-request.context';

interface RpcTransactionRequestLayoutProps extends HasChildren {
  title: string;
  totalSpend: Money | null;
  onApprove(): Promise<void>;
}
export function RpcTransactionRequestLayout({
  children,
  onApprove,
  title,
  totalSpend,
}: RpcTransactionRequestLayoutProps) {
  const { availableBalance, marketData } = useFeeEditorContext();
  const { isBroadcasting, isLoading, isSubmitted, origin, onClickRequestedByLink } =
    useRpcTransactionRequestContext();

  const showOverlay = isBroadcasting || isSubmitted;
  const isInsufficientBalance = !!(
    totalSpend && availableBalance.amount.isLessThan(totalSpend.amount)
  );

  return (
    <>
      <TransactionWrapper showOverlay={showOverlay}>
        <Approver requester={origin} width="100%">
          <Box position="relative">
            <BackgroundOverlay show={showOverlay} />
            <TransactionHeader
              title={title}
              href="https://leather.io/guides/connect-dapps"
              onPressRequestedByLink={e => {
                e.preventDefault();
                onClickRequestedByLink();
              }}
            />
            {children}
          </Box>
          <Approver.Actions
            actions={getTransactionActions({
              isBroadcasting,
              isSubmitted,
              isInsufficientBalance,
              isLoading,
              onCancel: () => closeWindow(),
              onApprove,
            })}
          >
            <TransactionActionsTitle
              amount={
                totalSpend
                  ? i18nFormatCurrency(baseCurrencyAmountInQuote(totalSpend, marketData))
                  : ''
              }
              isLoading={isLoading}
            />
            <TransactionError isInsufficientBalance={isInsufficientBalance} isLoading={isLoading} />
          </Approver.Actions>
        </Approver>
      </TransactionWrapper>
      <Outlet />
    </>
  );
}
