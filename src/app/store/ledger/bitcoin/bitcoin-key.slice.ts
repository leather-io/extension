import { BitcoinLedgerAccountDetails } from '@app/features/ledger/utils/bitcoin-ledger-utils';

import { RootState } from '../..';
import { generateLedgerChainKeyStorageSlice } from '../ledger-chain-key-storage-generator';

function selectBitcoinKeysSlice(state: RootState) {
  return state.ledger.bitcoin;
}

// ts-unused-exports:disable-next-line
export const { slice: bitcoinKeysSlice, adapter } =
  generateLedgerChainKeyStorageSlice<BitcoinLedgerAccountDetails>('bitcoin');

const selectors = adapter.getSelectors(selectBitcoinKeysSlice);

export const selectDefaultWalletBitcoinKeyEntities = selectors.selectEntities;
export const selectDefaultWalletBitcoinKeys = selectors.selectAll;
