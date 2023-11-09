import { Suspense } from 'react';

import { TransactionTypes } from '@stacks/connect';
import { NonFungiblePostCondition, STXPostCondition, addressToString } from '@stacks/transactions';

import {
  getAmountFromPostCondition,
  getIconStringFromPostCondition,
  getNameFromPostCondition,
  getPostConditionCodeMessage,
  getPostConditionTitle,
  getSymbolFromPostCondition,
} from '@app/common/transactions/stacks/post-condition.utils';
import { EventCard } from '@app/components/event-card';
import { LoadingSpinner } from '@app/components/loading-spinner';
import { useCurrentStacksAccount } from '@app/store/accounts/blockchain/stacks/stacks-account.hooks';
import { useTransactionRequestState } from '@app/store/transactions/requests.hooks';
import { truncateMiddle } from '@app/ui/utils/truncate-middle';

interface PostConditionItemProps {
  isLast?: boolean;
  pc: STXPostCondition | NonFungiblePostCondition;
}

function PostConditionItemSuspense(props: PostConditionItemProps): React.JSX.Element | null {
  const { pc, isLast } = props;
  const currentAccount = useCurrentStacksAccount();
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

export function PostConditionItem(props: PostConditionItemProps): React.JSX.Element {
  return (
    <Suspense fallback={<LoadingSpinner height="190px" />}>
      <PostConditionItemSuspense {...props} />
    </Suspense>
  );
}
