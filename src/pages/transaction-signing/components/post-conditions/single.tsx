import React from 'react';
import { TransactionTypes } from '@stacks/connect';

import { addressToString, PostCondition } from '@stacks/transactions';
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
import { useTransactionRequest } from '@store/transactions/requests.hooks';
import { TransactionEventCard } from '../event-card';
import { useAssetFromPostCondition } from '@store/transactions/post-conditions.hooks';

interface PostConditionProps {
  pc: PostCondition;
  isLast?: boolean;
}

export const PostConditionFallbackComponent: React.FC<PostConditionProps> = ({ pc, isLast }) => {
  const currentAccount = useCurrentAccount();
  const pendingTransaction = useTransactionRequest();
  const title = getPostConditionTitle(pc);
  const iconString = getIconStringFromPostCondition(pc);
  const ticker = getSymbolFromPostCondition(pc);
  const amount = getAmountFromPostCondition(pc);
  const name = getNameFromPostCondition(pc);
  const contractName = 'contractName' in pc.principal && pc.principal.contractName.content;
  const address = addressToString(pc.principal.address);
  const isSending = address === currentAccount?.address;

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
    <>
      <TransactionEventCard
        title={`${
          isContractPrincipal ? 'The contract ' : isSending ? 'You ' : 'Another address '
        } ${title}`}
        left={name}
        right={`${truncateMiddle(addressToString(pc.principal.address), 4)}${
          contractName ? `.${contractName}` : ''
        }`}
        amount={amount}
        ticker={ticker}
        icon={iconString}
        message={message}
        isLast={isLast}
      />
    </>
  );
};

export const PostConditionComponentSuspense: React.FC<PostConditionProps> = ({ pc, isLast }) => {
  const currentAccount = useCurrentAccount();
  const asset = useAssetFromPostCondition(pc);
  const pendingTransaction = useTransactionRequest();
  const title = getPostConditionTitle(pc);
  const iconString = getIconStringFromPostCondition(pc);
  const _ticker = getSymbolFromPostCondition(pc);
  const _amount = getAmountFromPostCondition(pc);
  const name = getNameFromPostCondition(pc);
  const contractName = 'contractName' in pc.principal && pc.principal.contractName.content;
  const address = addressToString(pc.principal.address);
  const isSending = address === currentAccount?.address;

  const amount = asset ? ftDecimals(_amount, asset.decimals) : _amount;
  const ticker = asset?.symbol || _ticker;

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
    <>
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
    </>
  );
};

export const PostConditionComponent = (props: PostConditionProps) => {
  return (
    <React.Suspense fallback={<PostConditionFallbackComponent {...props} />}>
      <PostConditionComponentSuspense {...props} />
    </React.Suspense>
  );
};
