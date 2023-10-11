import { StacksAppKeysResponseItem } from '@app/features/ledger/utils/stacks-ledger-utils';

import { RootState } from '../..';
import { generateLedgerChainKeyStorageSlice } from '../ledger-chain-key-storage-generator';

function selectStacksKeysSlice(state: RootState) {
  return state.ledger.stacks;
}

export const { slice: stacksKeysSlice, adapter } = generateLedgerChainKeyStorageSlice<
  StacksAppKeysResponseItem & { id: string }
>('stacks');

const selectors = adapter.getSelectors(selectStacksKeysSlice);

export const selectDefaultWalletStacksKeyEntities = selectors.selectEntities;
export const selectDefaultWalletStacksKeys = selectors.selectAll;
