import React, { useCallback, useState } from 'react';
import {
  Button,
  color,
  Text,
  Input,
  IconButton,
  Flex,
  Stack,
  StackProps,
  InputGroup,
  Box,
} from '@stacks/ui';
import { Caption } from '@components/typography';
import { BaseDrawer, BaseDrawerProps } from '@components/drawer';
import { buildAssetTransferTx } from '@store/transactions/fungible-token-transfer';
import { FiChevronUp as IconChevronUp, FiChevronDown as IconChevronDown } from 'react-icons/fi';
import { stacksValue } from '@common/stacks-utils';
import { useHandleSubmitTransaction } from '@pages/transaction-signing/hooks/use-submit-stx-transaction';
import { stxToMicroStx, truncateMiddle } from '@stacks/ui-utils';
import { useLoading } from '@common/hooks/use-loading';

import { useMakeTransferEffect } from '@pages/transaction-signing/hooks/use-make-stx-transfer';
import { useSelectedAsset } from '@common/hooks/use-selected-asset';
import { useCurrentAccount } from '@common/hooks/account/use-current-account';
import { SpaceBetween } from '@components/space-between';
import { NetworkRowItem } from '@components/network-row-item';
import { TransactionEventCard } from '@pages/transaction-signing/components/event-card';
import { accountBalancesState, currentAccountState } from '@store/accounts';
import { currentStacksNetworkState } from '@store/networks';
import { useAtomValue } from 'jotai/utils';
import { generateSTXTransferTx } from '@common/transactions/transaction-utils';
import { TransactionTypes, STXTransferPayload } from '@stacks/connect';
import BN from 'bn.js';
import { StacksTransaction } from '@stacks/transactions';

interface ConfirmSendDrawerProps extends BaseDrawerProps {
  amount: number;
  recipient: string;
  memo: string;
}

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

const Actions: React.FC<{ transaction: StacksTransaction | null; handleCancel: () => void }> = ({
  transaction,
  handleCancel,
}) => {
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
    </Stack>
  );
};

interface TxSettingsProps {
  transaction: StacksTransaction | null;
  setTransaction: (transaction: StacksTransaction) => void;
  amount: number;
  memo: string;
  recipient: string;
}

const TxSettings: React.FC<TxSettingsProps> = ({
  transaction,
  setTransaction,
  amount,
  memo,
  recipient,
}) => {
  const MAX_LENGTH_BIG_NUMBER = 16;
  const [nonceOverride, setNonceOverride] = React.useState(
    transaction?.auth?.spendingCondition?.nonce || 0
  );
  const network = useAtomValue(currentStacksNetworkState);
  const account = useAtomValue(currentAccountState);
  if (!account) return <></>;
  const senderKey = account.stxPrivateKey;

  if (!senderKey) return <></>;
  const stxAddress = account?.address;

  const { selectedAsset } = useSelectedAsset();
  const balances = useAtomValue(accountBalancesState);

  const handleChange = async (e: React.ChangeEvent<any>) => {
    if (!account || e.target.value.length >= MAX_LENGTH_BIG_NUMBER) return;
    let nonce;
    try {
      nonce = new BN(e.target.value, 10).toNumber();
    } catch (e) {
      // BN will throw an exception if not an integer, we keep the last value in that case
      return;
    }

    setNonceOverride(e.target.value);
    if (!selectedAsset) return;
    const bnAmount = stxToMicroStx(amount).toString();
    let tx;

    // Build the transaction again since the nonce has changed
    if (selectedAsset.type === 'stx') {
      let txData = {
        txType: TransactionTypes.STXTransfer,
        amount: bnAmount,
        memo,
        recipient,
        network,
      } as STXTransferPayload;
      tx = await generateSTXTransferTx({ txData, senderKey, nonce });
    } else {
      let txData = {
        amount,
        balances,
        memo,
        network,
        nonce,
        recipient,
        selectedAsset,
        senderKey,
        stxAddress,
      };
      tx = await buildAssetTransferTx(txData);
    }

    setTransaction(tx);
  };

  return (
    <Box>
      <InputGroup flexDirection="column">
        <Text as="label" display="block" mb="tight" fontSize={1} fontWeight="500" htmlFor="nonce">
          Nonce
        </Text>
        <Input
          display="block"
          width="100%"
          maxLength={MAX_LENGTH_BIG_NUMBER}
          name="nonce"
          onChange={handleChange}
          value={nonceOverride.toString()}
        />
      </InputGroup>
    </Box>
  );
};

export const ConfirmSendDrawer: React.FC<Omit<ConfirmSendDrawerProps, 'title'>> = ({
  isShowing,
  onClose,
  amount,
  memo,
  recipient,
}) => {
  const [transaction, setTransaction] = useState<StacksTransaction | null>(null);

  useMakeTransferEffect({
    transaction,
    setTransaction,
    isShowing,
    amount,
    memo,
    recipient,
    loadingKey: LOADING_KEY,
  });

  const handleCancel = useCallback(() => {
    setTransaction(null);
    onClose();
  }, [setTransaction, onClose]);

  const fee = transaction?.auth.spendingCondition?.fee?.toNumber();
  const editTxSettings = () => {
    setShowSettings(!showSettings);
  };

  const [showSettings, setShowSettings] = React.useState(false);

  return (
    <BaseDrawer title="Confirm transfer" isShowing={isShowing} onClose={handleCancel}>
      <Stack pb="extra-loose" px="loose" spacing="extra-loose">
        <TransactionDetails
          amount={amount}
          recipient={recipient}
          nonce={transaction?.auth.spendingCondition?.nonce.toNumber()}
          fee={transaction?.auth.spendingCondition?.fee?.toNumber()}
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
          <SpaceBetween flexDirection="row-reverse">
            <IconButton
              onClick={editTxSettings}
              icon={showSettings ? IconChevronUp : IconChevronDown}
            />
          </SpaceBetween>
          {showSettings ? (
            <TxSettings
              setTransaction={setTransaction}
              transaction={transaction}
              amount={amount}
              memo={memo}
              recipient={recipient}
            />
          ) : null}
        </Stack>
        <Actions transaction={transaction} handleCancel={handleCancel} />
      </Stack>
    </BaseDrawer>
  );
};
