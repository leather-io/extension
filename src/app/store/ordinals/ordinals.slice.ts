import { useSelector } from 'react-redux';

import { PayloadAction, createEntityAdapter, createSelector, createSlice } from '@reduxjs/toolkit';

import { RootState } from '..';
import { selectCurrentAccountIndex } from '../software-keys/software-key.selectors';

export type OrdinalsbotInscriptionStatus = 'pending' | 'paid' | 'waiting-for-indexer' | 'ready';

interface BasePendingBrc20Transfer {
  status: OrdinalsbotInscriptionStatus;
  accountIndex: number;
  id: string;
  recipient: string;
  amount: number;
  tick: string;
}
interface ReadyPendingBrc20Transfer extends BasePendingBrc20Transfer {
  status: 'ready';
  inscriptionId: string;
  accountIndex: number;
  id: string;
  recipient: string;
  amount: number;
  tick: string;
}

function isReadyPendingBrc20Transfer(t: PendingBrc20Transfer): t is ReadyPendingBrc20Transfer {
  return t.status === 'ready';
}

export type PendingBrc20Transfer = BasePendingBrc20Transfer | ReadyPendingBrc20Transfer;

const ordinalsAdapter = createEntityAdapter<PendingBrc20Transfer>();

export const ordinalsSlice = createSlice({
  name: 'ordinals',
  initialState: ordinalsAdapter.getInitialState(),
  reducers: {
    brc20TransferInitiated: ordinalsAdapter.addOne,
    brc20TransferPaid(state, action: PayloadAction<{ id: string }>) {
      const transfer = state.entities[action.payload.id];
      if (!transfer) return;
      transfer.status = 'paid';
    },
    brc20TransferAwaitingIndexer(state, action: PayloadAction<{ id: string }>) {
      const transfer = state.entities[action.payload.id];
      if (!transfer) return;
      transfer.status = 'waiting-for-indexer';
    },
    brc20TransferReady(state, action: PayloadAction<{ id: string; inscriptionId: string }>) {
      const transfer = state.entities[action.payload.id] as ReadyPendingBrc20Transfer | undefined;
      if (!transfer) return;
      transfer.status = 'ready';
      transfer.inscriptionId = action.payload.inscriptionId;
    },
    inscriptionSent(state, action: PayloadAction<{ inscriptionId: string }>) {
      const transferMatch = ordinalsAdapter
        .getSelectors()
        .selectAll(state)
        .filter(isReadyPendingBrc20Transfer)
        .find(pendingTransfer => pendingTransfer.inscriptionId === action.payload.inscriptionId);
      if (!transferMatch) return;
      ordinalsAdapter.removeOne(state, transferMatch.id);
    },
  },
});

export const {
  brc20TransferInitiated,
  brc20TransferPaid,
  brc20TransferAwaitingIndexer,
  brc20TransferReady,
  inscriptionSent,
} = ordinalsSlice.actions;

const selectors = ordinalsAdapter.getSelectors();

function selectBrc20TransferState(state: RootState) {
  return state.ordinals;
}

const selectAllTransfers = createSelector(selectBrc20TransferState, selectors.selectAll);

const selectAllTransfersMap = createSelector(selectBrc20TransferState, selectors.selectEntities);

const selectCurrentAccountBrc20Transfers = createSelector(
  selectAllTransfers,
  selectCurrentAccountIndex,
  (transfers, accountIndex) => transfers.filter(t => t.accountIndex === accountIndex)
);

export function usePendingBrc20Transfers() {
  return useSelector(selectCurrentAccountBrc20Transfers);
}

export function usePendingBrc20TransferEntities() {
  return useSelector(selectAllTransfersMap);
}
