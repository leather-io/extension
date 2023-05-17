import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { AnyContract, getId } from 'dlc-lib';

interface BitcoinContractsState {
  bitcoinContracts: any[];
  bitcoinContractProcessing: boolean;
  bitcoinContractActionSuccessful: boolean;
  bitcoinContractActionError: string | undefined;
  bitcoinContractSigningRequested: boolean;
  bitcoinContractAcceptMessageSubmitted: boolean;
  bitcoinContractCounterpartyWalletURL: string | undefined;
  selectedBitcoinContractID?: string;
  selectedBitcoinContract?: AnyContract;
}

const initialState: BitcoinContractsState = {
  bitcoinContracts: [],
  bitcoinContractProcessing: false,
  bitcoinContractActionSuccessful: false,
  bitcoinContractActionError: undefined,
  bitcoinContractSigningRequested: false,
  bitcoinContractAcceptMessageSubmitted: false,
  bitcoinContractCounterpartyWalletURL: undefined,
};

export interface FailedBitcoinContractDetails {
  bitcoinContractID: string;
  bitcoinContractActionError: string;
}

export const bitcoinContractsSlice = createSlice({
  name: 'bitcoinContracts',
  initialState,
  reducers: {
    requestOfferedContractProcess(state, action: PayloadAction<string>) {
      console.log('Request Offered Contract Process');
      const bitcoinCounterpartyWalletURL = action.payload;

      state.bitcoinContractProcessing = true;
      state.bitcoinContractActionSuccessful = false;
      state.bitcoinContractActionError = undefined;
      state.bitcoinContractSigningRequested = false;
      state.bitcoinContractAcceptMessageSubmitted = false;
      state.bitcoinContractCounterpartyWalletURL = bitcoinCounterpartyWalletURL;
      state.selectedBitcoinContractID = undefined;
    },
    requestOfferedContractAcceptance(state) {
      state.bitcoinContractProcessing = true;
      state.bitcoinContractAcceptMessageSubmitted = true;
    },
    requestOfferedContractRejection(state) {
      state.bitcoinContractProcessing = true;
    },
    requestOfferedContractSigning(state) {
      state.bitcoinContractProcessing = true;
      state.bitcoinContractSigningRequested = true;
    },
    updateContractsOnSuccessfulAction(state, action: PayloadAction<AnyContract>) {
      console.log('Update Contracts On Successful Action');
      const storedContracts = state.bitcoinContracts;
      const updatedContract = action.payload;

      const { updatedContracts, updatedContractID } = updateContracts(
        storedContracts,
        updatedContract
      );

      console.log('Updated Contracts', updatedContracts)
        console.log('Updated Contract ID', updatedContractID)

      state.bitcoinContractProcessing = false;
      state.bitcoinContractActionSuccessful = true;
      state.bitcoinContracts = updatedContracts;
      state.selectedBitcoinContractID = updatedContractID;

      console.log('Updated Contracts State', state.bitcoinContracts)
    },
    updateContractsOnFailedAction(state, action: PayloadAction<FailedBitcoinContractDetails>) {
      const storedContracts = state.bitcoinContracts;
      const { bitcoinContractActionError, bitcoinContractID } = action.payload;

      const failedContractIndex = storedContracts.findIndex(
        c => getId(c) === bitcoinContractID || c.temporaryContractId === bitcoinContractID
      );

      const updatedContracts = storedContracts.splice(failedContractIndex, 1);

      state.bitcoinContractProcessing = false;
      state.bitcoinContractActionSuccessful = false;
      state.bitcoinContracts = updatedContracts;
      state.bitcoinContractActionError = bitcoinContractActionError;
    },
  },
});

export const {
  requestOfferedContractProcess,
  requestOfferedContractAcceptance,
  requestOfferedContractRejection,
  requestOfferedContractSigning,
  updateContractsOnSuccessfulAction,
  updateContractsOnFailedAction,
} = bitcoinContractsSlice.actions;

function updateContracts(storedContracts: AnyContract[], updatedContract: AnyContract) {
  let updatedContracts: AnyContract[] = [];

  const existingContractIndex = storedContracts.findIndex(
    c =>
      getId(c) === getId(updatedContract) ||
      c.temporaryContractId === updatedContract.temporaryContractId
  );

  updatedContracts =
    existingContractIndex >= 0
      ? storedContracts.map((c, index) => (index === existingContractIndex ? updatedContract : c))
      : [...storedContracts, updatedContract];

  const updatedContractID = getId(updatedContract);

  return { updatedContracts, updatedContractID };
}
