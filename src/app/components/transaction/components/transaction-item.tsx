import { createSearchParams, useLocation, useNavigate } from 'react-router-dom';
import type { MempoolTransaction } from '@stacks/stacks-blockchain-api-types';
import { Box, BoxProps, color, Flex, Stack, Text, useMediaQuery } from '@stacks/ui';
import { isPendingTx } from '@stacks/ui-utils';

import { useExplorerLink } from '@app/common/hooks/use-explorer-link';
import { whenPageMode } from '@app/common/utils';
import { useWalletType } from '@app/common/use-wallet-type';
import { openIndexPageInNewTab } from '@app/common/utils/open-in-new-tab';
import { Title } from '@app/components/typography';
import { SpaceBetween } from '@app/components/space-between';
import { useCurrentAccount } from '@app/store/accounts/account.hooks';
import { usePressable } from '@app/components/item-hover';
import { getTxCaption, getTxTitle, getTxValue } from '@app/common/transactions/transaction-utils';
import { useAnalytics } from '@app/common/hooks/analytics/use-analytics';
import { TransactionTitle } from '@app/components/transaction/components/transaction-title';
import { Tx } from '@app/common/api/transactions';
import { useRawTxIdState } from '@app/store/transactions/raw.hooks';
import { RouteUrls } from '@shared/route-urls';
import { SendFormSelectors } from '@tests/page-objects/send-form.selectors';

import { TransactionIcon } from './transaction-icon';
import { TransactionStatus } from './transaction-status';
import { IncreaseFeeButton } from './increase-fee-button';
import { TxTransferDetails } from './transaction-transfers';

interface TransactionItemProps extends BoxProps {
  transferDetails?: TxTransferDetails;
  transaction?: Tx;
}
export const TransactionItem = ({
  transferDetails,
  transaction,
  ...rest
}: TransactionItemProps) => {
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
    handleOpenTxLink(transaction?.tx_id || transferDetails?.link || '');
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
  const icon = transaction ? <TransactionIcon transaction={transaction} /> : transferDetails?.icon;
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
              {transaction ? <TransactionStatus transaction={transaction} /> : null}
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
