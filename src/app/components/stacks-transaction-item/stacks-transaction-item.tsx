import { createSearchParams, useLocation, useNavigate } from 'react-router-dom';

import type { MempoolTransaction } from '@stacks/stacks-blockchain-api-types';
import { Box, BoxProps, Flex, Stack, Text, color, useMediaQuery } from '@stacks/ui';
import { isPendingTx } from '@stacks/ui-utils';
import { SendFormSelectors } from '@tests-legacy/page-objects/send-form.selectors';

import { StacksTx, TxTransferDetails } from '@shared/models/transactions/stacks-transaction.model';
import { RouteUrls } from '@shared/route-urls';

import { useAnalytics } from '@app/common/hooks/analytics/use-analytics';
import { useExplorerLink } from '@app/common/hooks/use-explorer-link';
import {
  getTxCaption,
  getTxTitle,
  getTxValue,
} from '@app/common/transactions/stacks/transaction.utils';
import { useWalletType } from '@app/common/use-wallet-type';
import { whenPageMode } from '@app/common/utils';
import { openIndexPageInNewTab } from '@app/common/utils/open-in-new-tab';
import { usePressable } from '@app/components/item-hover';
import { SpaceBetween } from '@app/components/space-between';
import { TransactionTitle } from '@app/components/transaction/transaction-title';
import { Title } from '@app/components/typography';
import { useCurrentAccount } from '@app/store/accounts/account.hooks';
import { useRawTxIdState } from '@app/store/transactions/raw.hooks';

import { IncreaseFeeButton } from './increase-fee-button';
import { StacksTransactionIcon } from './stacks-transaction-icon';
import { StacksTransactionStatus } from './stacks-transaction-status';

interface StacksTransactionItemProps extends BoxProps {
  transferDetails?: TxTransferDetails;
  transaction?: StacksTx;
}
export const StacksTransactionItem = ({
  transferDetails,
  transaction,
  ...rest
}: StacksTransactionItemProps) => {
  const [component, bind, { isHovered }] = usePressable(true);
  const { handleOpenTxLink } = useExplorerLink();
  const currentAccount = useCurrentAccount();
  const analytics = useAnalytics();
  const [_, setRawTxId] = useRawTxIdState();
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { whenWallet } = useWalletType();

  const [hideIncreaseFeeButton] = useMediaQuery('(max-width: 355px)');

  if (!transaction && !transferDetails) return null;

  const openTxLink = () => {
    void analytics.track('view_transaction');
    handleOpenTxLink({
      blockchain: 'stacks',
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
          full: () => navigate(RouteUrls.IncreaseFee),
          popup: () => openIndexPageInNewTab(RouteUrls.IncreaseFee, urlSearchParams),
        })(),
      software: () => navigate(RouteUrls.IncreaseFee),
    })();
  };

  const isOriginator = transaction?.sender_address === currentAccount?.address;
  const isPending = transaction && isPendingTx(transaction as MempoolTransaction);

  const caption = transaction ? getTxCaption(transaction) : transferDetails?.caption || '';
  const icon = transaction ? (
    <StacksTransactionIcon transaction={transaction} />
  ) : (
    transferDetails?.icon
  );
  const title = transaction ? getTxTitle(transaction) : transferDetails?.title || '';
  const value = transaction ? getTxValue(transaction, isOriginator) : transferDetails?.value;

  return (
    <Box position="relative" cursor="pointer" {...bind} {...rest}>
      <Stack
        alignItems="center"
        isInline
        onClick={openTxLink}
        position="relative"
        spacing="base-loose"
        zIndex={2}
      >
        {icon}
        <Flex flexDirection="column" flexGrow={1} minWidth="0px">
          <SpaceBetween spacing="extra-loose">
            <TransactionTitle title={title} />
            {value && (
              <Title data-testid={SendFormSelectors.SentTokenValue} fontWeight="normal">
                {value}
              </Title>
            )}
          </SpaceBetween>
          <SpaceBetween minHeight="loose" minWidth="0px" mt="extra-tight">
            <Stack alignItems="center" isInline>
              <Text color={color('text-caption')} fontSize={0} whiteSpace="nowrap">
                {caption}
              </Text>
              {transaction ? <StacksTransactionStatus transaction={transaction} /> : null}
            </Stack>
            {!hideIncreaseFeeButton ? (
              <IncreaseFeeButton
                isEnabled={isOriginator && isPending}
                isHovered={isHovered}
                isSelected={pathname === RouteUrls.IncreaseFee}
                onIncreaseFee={onIncreaseFee}
              />
            ) : null}
          </SpaceBetween>
        </Flex>
      </Stack>
      {component}
    </Box>
  );
};
