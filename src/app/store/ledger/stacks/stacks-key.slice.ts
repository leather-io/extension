import { StacksAppKeysResponseItem } from '@app/features/ledger/utils/stacks-ledger-utils';

import { RootState } from '../..';
import { generateLedgerChainKeyStorageSlice } from '../ledger-chain-key-storage-generator';

function selectStacksKeysSlice(state: RootState) {
  return state.ledger.stacks;
}

// ts-unused-exports:disable-next-line
export const { slice: stacksKeysSlice, adapter } = generateLedgerChainKeyStorageSlice<
  StacksAppKeysResponseItem & { id: string; targetId: string }
>('stacks');

const selectors = adapter.getSelectors(selectStacksKeysSlice);

export const selectDefaultWalletStacksKeys = selectors.selectAll;
