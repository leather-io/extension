import { Suspense } from 'react';
import { TransactionTypes } from '@stacks/connect';
import { addressToString, NonFungiblePostCondition, STXPostCondition } from '@stacks/transactions';
import { truncateMiddle } from '@stacks/ui-utils';

import {
  getAmountFromPostCondition,
  getIconStringFromPostCondition,
  getNameFromPostCondition,
  getPostConditionCodeMessage,
  getPostConditionTitle,
  getSymbolFromPostCondition,
} from '@app/common/transactions/post-condition-utils';
import { LoadingSpinner } from '@app/components/loading-spinner';
import { EventCard } from '@app/components/event-card';
import { useCurrentAccount } from '@app/store/accounts/account.hooks';
import { useTransactionRequestState } from '@app/store/transactions/requests.hooks';

interface PostConditionItemProps {
  isLast?: boolean;
  pc: STXPostCondition | NonFungiblePostCondition;
}

function PostConditionItemSuspense(props: PostConditionItemProps): JSX.Element | null {
  const { pc, isLast } = props;
  const currentAccount = useCurrentAccount();
  const pendingTransaction = useTransactionRequestState();

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
    <EventCard
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
  );
}

export function PostConditionItem(props: PostConditionItemProps): JSX.Element {
  return (
    <Suspense fallback={<LoadingSpinner height="190px" />}>
      <PostConditionItemSuspense {...props} />
    </Suspense>
  );
}
