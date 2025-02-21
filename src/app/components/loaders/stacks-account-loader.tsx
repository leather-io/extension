import { ReactNode } from 'react';

import type { DistributedOmit } from 'type-fest';

import { useCurrentAccountIndex } from '@app/store/accounts/account';
import {
  useCurrentStacksAccount,
  useStacksAccounts,
} from '@app/store/accounts/blockchain/stacks/stacks-account.hooks';
import { StacksAccount } from '@app/store/accounts/blockchain/stacks/stacks-account.models';

interface CurrentStacksAccountLoaderProps {
  children(data: StacksAccount): ReactNode;
  fallback?: ReactNode;
}
export function CurrentStacksAccountLoader({
  children,
  fallback,
}: CurrentStacksAccountLoaderProps) {
  const currentAccount = useCurrentStacksAccount();
  if (!currentAccount) return fallback;
  return children(currentAccount);
}

interface StacksAccountBaseLoaderProps {
  children(data: StacksAccount): React.ReactNode;
}

interface StacksAccountCurrentLoaderProps extends StacksAccountBaseLoaderProps {
  current: true;
}

interface StacksAccountIndexLoaderProps extends StacksAccountBaseLoaderProps {
  index: number;
}

type StacksAccountLoaderProps = StacksAccountCurrentLoaderProps | StacksAccountIndexLoaderProps;

export function useStacksAccountLoader(
  props: DistributedOmit<StacksAccountLoaderProps, 'children'>
) {
  const stacksAccounts = useStacksAccounts();
  const currentAccountIndex = useCurrentAccountIndex();

  const properIndex = 'current' in props ? currentAccountIndex : props.index;
  const account = stacksAccounts[properIndex];

  if (!account) return null;
  return account;
}
