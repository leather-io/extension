import { PayloadAction, createEntityAdapter, createSlice } from '@reduxjs/toolkit';

import { defaultWalletKeyId } from '@shared/utils';

interface RequiresId {
  id: string;
  targetId: string;
}

export function generateLedgerChainKeyStorageSlice<KeyDetails extends RequiresId>(name: string) {
  type KeyDetailsWithWalletId = KeyDetails & { walletId: string };

  const adapter = createEntityAdapter<KeyDetailsWithWalletId>();

  const initialState = adapter.getInitialState();

  const slice = createSlice({
    name: name + 'Keys',
    initialState,
    reducers: {
      addKeys(state, { payload }: PayloadAction<KeyDetails[]>) {
        adapter.addMany(
          state as any,
          // While we only support a single wallet, we default to the `default` walletId
          payload.map(key => ({ ...key, walletId: defaultWalletKeyId }))
        );
      },
      signOut(state) {
        adapter.removeAll(state as any);
      },
    },
  });

  return { slice, initialState, adapter };
}
