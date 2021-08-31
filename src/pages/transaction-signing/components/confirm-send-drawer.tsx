import React from 'react';
import { Button, color, Flex, Stack, StackProps } from '@stacks/ui';
import { Caption } from '@components/typography';
import { BaseDrawer, BaseDrawerProps } from '@components/drawer';
import { StacksTransaction } from '@stacks/transactions';
import { stacksValue } from '@common/stacks-utils';
import { useHandleSubmitTransaction } from '@pages/transaction-signing/hooks/use-submit-stx-transaction';
import { truncateMiddle } from '@stacks/ui-utils';
import { useLoading } from '@common/hooks/use-loading';
import { useSelectedAsset } from '@common/hooks/use-selected-asset';
import { useCurrentAccount } from '@store/accounts/account.hooks';
import { SpaceBetween } from '@components/space-between';
import { NetworkRowItem } from '@components/network-row-item';
import { TransactionEventCard } from '@pages/transaction-signing/components/event-card';
import { useDrawers } from '@common/hooks/use-drawers';
import {
  useLocalTransactionInputsState,
  useTxForSettingsState,
} from '@store/transactions/transaction.hooks';
import { useCurrentFee } from '@store/transactions/fees.hooks';
import { ShowTxSettingsAction } from '@features/tx-settings-drawer/components/show-tx-settings-action';

const LOADING_KEY = 'confirm-send-drawer';

const TransactionDetails: React.FC<
  {
    amount: number;
    nonce?: number;
    fee?: number;
    recipient: string;
  } & StackProps
> = ({ amount, nonce, fee, recipient, ...rest }) => {
  const { ticker } = useSelectedAsset();
  const currentAccount = useCurrentAccount();
  const { selectedAsset } = useSelectedAsset();
  const gradientString = `${selectedAsset?.contractAddress}.${selectedAsset?.contractName}::${selectedAsset?.name}`;
  return (
    <Flex
      border="4px solid"
      borderColor={color('border')}
      borderRadius="12px"
      width="100%"
      flexDirection="column"
      {...rest}
    >
      <TransactionEventCard
        amount={amount}
        icon={selectedAsset?.contractAddress ? gradientString : 'STX'}
        ticker={ticker || 'STX'}
        title="You will transfer exactly"
        left={
          currentAccount?.address ? `From ${truncateMiddle(currentAccount?.address, 4)}` : undefined
        }
        right={`To ${truncateMiddle(recipient, 4)}`}
      />
    </Flex>
  );
};

const Actions: React.FC<{
  transaction: StacksTransaction | null;
  handleCancel: () => void;
}> = ({ transaction, handleCancel }) => {
  const { isLoading } = useLoading(LOADING_KEY);
  const handleSubmit = useHandleSubmitTransaction({
    transaction,
    onClose: handleCancel,
    loadingKey: LOADING_KEY,
  });
  return (
    <Stack spacing="base" width="100%">
      <Button
        borderRadius="12px"
        mode="primary"
        isDisabled={!transaction || isLoading}
        onClick={() => {
          void handleSubmit();
        }}
        isLoading={!transaction || isLoading}
      >
        Send
      </Button>
      <ShowTxSettingsAction />
    </Stack>
  );
};

export const ConfirmSendDrawer: React.FC<Omit<BaseDrawerProps, 'title'>> = ({
  isShowing,
  onClose,
}) => {
  const [txData] = useLocalTransactionInputsState();
  const [transaction] = useTxForSettingsState();
  const fee = useCurrentFee();
  const { showTxSettings } = useDrawers();
  const handleCancel = onClose;
  if (!transaction || !txData || !isShowing) return null;

  return (
    <BaseDrawer
      title="Confirm transfer"
      isShowing={isShowing}
      onClose={handleCancel}
      pauseOnClickOutside={showTxSettings}
    >
      <Stack pb="extra-loose" px="loose" spacing="loose">
        <TransactionDetails
          amount={txData.amount}
          recipient={txData.recipient}
          nonce={transaction?.auth.spendingCondition?.nonce.toNumber()}
          fee={fee}
        />
        <Stack spacing="base">
          <SpaceBetween>
            <Caption>Fees</Caption>
            <Caption>
              {(fee && stacksValue({ value: fee, fixedDecimals: true, withTicker: true })) || '--'}
            </Caption>
          </SpaceBetween>
          <SpaceBetween>
            <Caption>Network</Caption>
            <NetworkRowItem />
          </SpaceBetween>
        </Stack>
        <Actions transaction={transaction} handleCancel={handleCancel} />
      </Stack>
    </BaseDrawer>
  );
};
