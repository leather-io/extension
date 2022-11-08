import { EntityId, PayloadAction, createEntityAdapter, createSlice } from '@reduxjs/toolkit';

export interface SubmittedTransaction {
  rawTx: string;
  txId: string;
}

export const submittedTransactionsAdapter = createEntityAdapter<SubmittedTransaction>({
  selectId: submittedTransaction => submittedTransaction.txId,
});

const initialSubmittedTransactionsState = submittedTransactionsAdapter.getInitialState();

export const submittedTransactionsSlice = createSlice({
  name: 'submittedTransactions',
  initialState: initialSubmittedTransactionsState,
  reducers: {
    newTransactionSubmitted(state, action: PayloadAction<SubmittedTransaction>) {
      submittedTransactionsAdapter.addOne(state, action.payload);
    },
    transactionEnteredMempool(state, action: PayloadAction<EntityId>) {
      submittedTransactionsAdapter.removeOne(state, action.payload);
    },
    transactionReplacedByFee(state, action: PayloadAction<EntityId>) {
      submittedTransactionsAdapter.removeOne(state, action.payload);
    },
  },
});
