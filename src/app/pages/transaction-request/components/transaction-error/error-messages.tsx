import { memo } from 'react';
import { Navigate } from 'react-router-dom';
import { STXTransferPayload, TransactionTypes } from '@stacks/connect';
import { color, Stack, useClipboard, Fade, Flex } from '@stacks/ui';
import { truncateMiddle } from '@stacks/ui-utils';

import { stacksValue } from '@app/common/stacks-utils';
import { useScrollLock } from '@app/common/hooks/use-scroll-lock';
import { useCurrentNetwork } from '@app/common/hooks/use-current-network';
import { useDrawers } from '@app/common/hooks/use-drawers';
import { Caption } from '@app/components/typography';
import { SpaceBetween } from '@app/components/space-between';
import { ErrorMessage } from '@app/pages/transaction-request/components/transaction-error/error-message';
import {
  useTransactionBroadcastError,
  useTransactionRequestState,
} from '@app/store/transactions/requests.hooks';
import { useCurrentAccountAvailableStxBalance } from '@app/store/accounts/account.hooks';
import { useCurrentAccount } from '@app/store/accounts/account.hooks';
import { RouteUrls } from '@shared/route-urls';

export const FeeInsufficientFundsErrorMessage = memo(props => {
  const currentAccount = useCurrentAccount();
  const { setShowSwitchAccountsState } = useDrawers();
  const { onCopy, hasCopied } = useClipboard(currentAccount?.address || '');
  return (
    <ErrorMessage
      title="Insufficient balance"
      body={`You do not have enough STX to cover the network fees for this transaction.`}
      actions={[
        { onClick: () => setShowSwitchAccountsState(true), label: 'Switch account' },
        { onClick: () => onCopy(), label: hasCopied ? 'Copied!' : 'Copy address' },
      ]}
      {...props}
    />
  );
});

export const StxTransferInsufficientFundsErrorMessage = memo(props => {
  const pendingTransaction = useTransactionRequestState();
  const availableStxBalance = useCurrentAccountAvailableStxBalance();
  const currentAccount = useCurrentAccount();
  const { setShowSwitchAccountsState } = useDrawers();
  const { onCopy, hasCopied } = useClipboard(currentAccount?.address || '');
  return (
    <ErrorMessage
      title="Insufficient balance"
      body={
        <Stack spacing="loose">
          <Caption color={color('text-body')}>
            You don't have enough STX to make this transfer. Send some STX to this address, or
            switch to another account.
          </Caption>

          <Stack spacing="base" justifyContent="flex-end" textAlign="right">
            <SpaceBetween>
              <Caption>Current balance</Caption>
              <Caption>
                {availableStxBalance
                  ? stacksValue({
                      value: availableStxBalance,
                      withTicker: true,
                    })
                  : '--'}
              </Caption>
            </SpaceBetween>
            <SpaceBetween>
              <Caption>Transfer amount</Caption>
              <Caption>
                {stacksValue({
                  value: (pendingTransaction as STXTransferPayload).amount,
                  withTicker: true,
                })}
              </Caption>
            </SpaceBetween>
          </Stack>
        </Stack>
      }
      actions={[
        { onClick: () => setShowSwitchAccountsState(true), label: 'Switch account' },
        { onClick: () => onCopy(), label: hasCopied ? 'Copied!' : 'Copy address' },
      ]}
      {...props}
    />
  );
});

export const NoContractErrorMessage = memo(props => {
  const network = useCurrentNetwork();
  const pendingTransaction = useTransactionRequestState();

  if (!pendingTransaction || pendingTransaction.txType !== TransactionTypes.ContractCall)
    return null;
  return (
    <ErrorMessage
      title="Contract not found"
      body={`The contract (${truncateMiddle(pendingTransaction.contractAddress)}.${
        pendingTransaction.contractName
      }) that you are trying to call cannot be found on ${network.mode}.`}
      {...props}
    />
  );
});

export const IncorrectContractAddressMessage = memo(props => {
  const pendingTransaction = useTransactionRequestState();

  if (!pendingTransaction || pendingTransaction.txType !== TransactionTypes.ContractCall)
    return null;
  return (
    <ErrorMessage
      title="Invalid contract address"
      body={`The contract address (${truncateMiddle(
        pendingTransaction.contractAddress
      )}) that you are trying to call is not a valid Stacks address.`}
      {...props}
    />
  );
});

export const UnauthorizedRequestRedirect = memo(() => {
  return <Navigate to={RouteUrls.UnauthorizedRequest} />;
});

// TODO: Change this to new Error component?
export const ExpiredRequestErrorMessage = memo(props => {
  useScrollLock(true);
  return (
    <Fade in>
      {styles => (
        <Flex
          position="fixed"
          width="100%"
          height="100vh"
          zIndex={99}
          left={0}
          top={0}
          alignItems="center"
          justifyContent="center"
          p="loose"
          bg="rgba(0,0,0,0.35)"
          backdropFilter="blur(10px)"
          style={styles}
        >
          <ErrorMessage
            title="Expired request"
            body="This transaction request has expired or cannot be validated, please try to re-initiate this transaction request from the original app."
            border={'1px solid'}
            borderColor={color('border')}
            boxShadow="high"
            css={{
              '& > *': {
                pointerEvents: 'all',
              },
            }}
            {...props}
          />
        </Flex>
      )}
    </Fade>
  );
});

export const BroadcastErrorMessage = memo(props => {
  const broadcastError = useTransactionBroadcastError();
  if (!broadcastError) return null;
  return (
    <ErrorMessage
      title="There was an error when broadcasting this transaction:"
      body={broadcastError}
      {...props}
    />
  );
});
