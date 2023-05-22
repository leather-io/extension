import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { AnyContract, getId } from 'dlc-lib';

interface BitcoinContractsState {
  bitcoinContractProcessing: boolean;
  bitcoinContractActionSuccessful: boolean;
  bitcoinContractActionError?: string | undefined;
  bitcoinContractAcceptMessageSubmitted: boolean;
  bitcoinContractCounterpartyWalletURL?: string | undefined;
  selectedBitcoinContractID: string | undefined;
}

const initialState: BitcoinContractsState = {
  bitcoinContractProcessing: false,
  bitcoinContractActionSuccessful: false,
  bitcoinContractAcceptMessageSubmitted: false,
  selectedBitcoinContractID: undefined,
};

export interface FailedBitcoinContractDetails {
  bitcoinContractID: string;
  bitcoinContractActionError: string;
}

export const bitcoinContractsSlice = createSlice({
  name: 'bitcoinContracts',
  initialState: initialState,
  reducers: {
    requestClearState(state) {
      console.log('Request Clear State');
      state.selectedBitcoinContractID = undefined;
      state.bitcoinContractProcessing = false;
      state.bitcoinContractActionSuccessful = false;
      state.bitcoinContractActionError = undefined;
      state.bitcoinContractAcceptMessageSubmitted = false;
    },
    requestOfferedContractProcess(state, action: PayloadAction<string>) {
      console.log('Request Offered Contract Process');

      const bitcoinCounterpartyWalletURL = action.payload;

      state.bitcoinContractProcessing = true;
      state.bitcoinContractCounterpartyWalletURL = bitcoinCounterpartyWalletURL;
    },
    requestOfferedContractAcceptance(state) {
      console.log('Request Offered Contract Acceptance');

      state.bitcoinContractProcessing = true;
      state.bitcoinContractAcceptMessageSubmitted = true;
    },
    requestOfferedContractRejection(state) {
      console.log('Request Offered Contract Rejection');

      state.bitcoinContractProcessing = true;
    },
    updateContractsOnSuccessfulAction(state, action: PayloadAction<AnyContract>) {
      console.log('Update Contracts On Successful Action');

      const updatedContract = action.payload;

      console.log('Updated Contract On Successful Action', updatedContract);
      console.log('Updated Contract ID On Successful Action', getId(updatedContract));

      state.bitcoinContractProcessing = false;
      state.bitcoinContractActionSuccessful = true;
      state.selectedBitcoinContractID = getId(updatedContract);
    },
    updateContractsOnFailedAction(state, action: PayloadAction<FailedBitcoinContractDetails>) {
      console.log('Update Contracts On Failed Action');

      const { bitcoinContractActionError } = action.payload;

      state.bitcoinContractProcessing = false;
      state.bitcoinContractActionSuccessful = false;
      state.selectedBitcoinContractID = undefined;
      state.bitcoinContractCounterpartyWalletURL = undefined;
      state.bitcoinContractActionError = bitcoinContractActionError;
    },
  },
});

export const {
  requestClearState,
  requestOfferedContractProcess,
  requestOfferedContractAcceptance,
  requestOfferedContractRejection,
  updateContractsOnSuccessfulAction,
  updateContractsOnFailedAction,
} = bitcoinContractsSlice.actions;
