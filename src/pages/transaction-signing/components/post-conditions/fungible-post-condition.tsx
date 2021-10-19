import React from 'react';

import { TransactionEventCard } from '@pages/transaction-signing/components/transaction-event-card';
import { TransactionTypes } from '@stacks/connect';
import { addressToString } from '@stacks/transactions';
import { truncateMiddle } from '@stacks/ui-utils';
import { ftDecimals } from '@common/stacks-utils';
import { useCurrentAccount } from '@store/accounts/account.hooks';
import {
  getAmountFromPostCondition,
  getIconStringFromPostCondition,
  getNameFromPostCondition,
  getPostConditionCodeMessage,
  getPostConditionTitle,
  getSymbolFromPostCondition,
} from '@common/transactions/post-condition-utils';
import { useTransactionRequestState } from '@store/transactions/requests.hooks';
import { useAssetFromFungiblePostCondition } from '@store/transactions/post-conditions.hooks';
import { LoadingSpinner } from '@components/loading-spinner';
import { FungiblePostCondition } from '@common/types';

interface FungiblePostConditionProps {
  pc: FungiblePostCondition;
  isLast?: boolean;
}

const FungiblePostConditionComponentSuspense: React.FC<FungiblePostConditionProps> = ({
  pc,
  isLast,
}) => {
  const currentAccount = useCurrentAccount();
  const pendingTransaction = useTransactionRequestState();
  // Use token meta data if available
  const asset = useAssetFromFungiblePostCondition(pc);

  const title = getPostConditionTitle(pc);
  const iconString = getIconStringFromPostCondition(pc);
  const pcTicker = getSymbolFromPostCondition(pc);
  const pcAmount = getAmountFromPostCondition(pc);
  const name = getNameFromPostCondition(pc);

  const contractName = 'contractName' in pc.principal && pc.principal.contractName.content;
  const address = addressToString(pc.principal.address);
  const isSending = address === currentAccount?.address;

  const amount = asset?.decimals ? ftDecimals(pcAmount, asset.decimals) : pcAmount;
  const ticker = asset?.symbol || pcTicker;

  const isContractPrincipal =
    !!contractName ||
    (pendingTransaction?.txType == TransactionTypes.ContractCall &&
      pendingTransaction.contractAddress === address) ||
    address.includes('.');

  if (!pendingTransaction) return null;

  const message = pc.conditionCode
    ? `${getPostConditionCodeMessage(
        pc.conditionCode,
        isSending
      )} ${amount} ${ticker} or the transaction will abort.`
    : undefined;

  return (
    <TransactionEventCard
      title={`${
        isContractPrincipal ? 'The contract ' : isSending ? 'You ' : 'Another address '
      } ${title}`}
      left={asset?.name || name}
      right={`${truncateMiddle(addressToString(pc.principal.address), 4)}${
        contractName ? `.${contractName}` : ''
      }`}
      amount={amount}
      ticker={ticker}
      icon={iconString}
      message={message}
      isLast={isLast}
    />
  );
};

export const FungiblePostConditionComponent = (props: FungiblePostConditionProps) => {
  return (
    <React.Suspense fallback={<LoadingSpinner height="190px" />}>
      <FungiblePostConditionComponentSuspense {...props} />
    </React.Suspense>
  );
};
