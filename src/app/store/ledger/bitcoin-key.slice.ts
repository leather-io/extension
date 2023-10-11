import { PayloadAction, createEntityAdapter, createSlice } from '@reduxjs/toolkit';

import { defaultWalletKeyId } from '@shared/utils';

import { BitcoinLedgerAccountDetails } from '@app/features/ledger/utils/bitcoin-ledger-utils';

import { RootState } from '..';

interface PersistedBitcoinKeys extends BitcoinLedgerAccountDetails {
  walletId: string;
}

const bitcoinKeyAdapter = createEntityAdapter<PersistedBitcoinKeys>();

export const bitcoinKeysSlice = createSlice({
  name: 'bitcoinsKeys',
  initialState: bitcoinKeyAdapter.getInitialState(),
  reducers: {
    addBitcoinKeys(state, { payload }: PayloadAction<BitcoinLedgerAccountDetails[]>) {
      bitcoinKeyAdapter.addMany(
        state,
        // While we only support a single wallet, we default to the `default` walletId
        payload.map(key => ({ ...key, walletId: defaultWalletKeyId }))
      );
    },
  },
});

function selectBitcoinKeysSlice(state: RootState) {
  return state.ledger.bitcoin;
}

const selectors = bitcoinKeyAdapter.getSelectors(selectBitcoinKeysSlice);

export const selectDefaultWalletBitcoinKeyEntities = selectors.selectEntities;
