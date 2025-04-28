import { useSelector } from 'react-redux';

import { createSelector } from '@reduxjs/toolkit';

import { sumNumbers } from '@leather.io/utils';

import { RootState } from '..';

const selectLedger = (state: RootState) => state.ledger;

const selectNumberOfLedgerKeysPersisted = createSelector(selectLedger, ledger =>
  sumNumbers(Object.values(ledger).map(chain => Object.keys(chain.entities).length))
);

const selectNumberOfLedgerBitcoinKeysPersisted = createSelector(selectLedger, ledger =>
  sumNumbers(Object.values(ledger.bitcoin).map(entities => Object.keys(entities).length))
);

const selectNumberOfLedgerStacksKeysPersisted = createSelector(selectLedger, ledger =>
  sumNumbers(Object.values(ledger.stacks).map(entities => Object.keys(entities).length))
);

export const selectHasLedgerKeys = createSelector(selectNumberOfLedgerKeysPersisted, numOfKeys =>
  numOfKeys.isGreaterThan(0)
);

const selectHasLedgerBitcoinKeys = createSelector(
  selectNumberOfLedgerBitcoinKeysPersisted,
  numOfKeys => numOfKeys.isGreaterThan(0)
);

const selectHasLedgerStacksKeys = createSelector(
  selectNumberOfLedgerStacksKeysPersisted,
  numOfKeys => numOfKeys.isGreaterThan(0)
);

export function useHasLedgerKeys() {
  return useSelector(selectHasLedgerKeys);
}

export function useHasLedgerBitcoinKeys() {
  return useSelector(selectHasLedgerBitcoinKeys);
}

export function useHasLedgerStacksKeys() {
  return useSelector(selectHasLedgerStacksKeys);
}

export function useLedgerDeviceTargetId() {
  return useSelector(
    (state: RootState) =>
      state.ledger.stacks.entities[0]?.targetId || state.ledger.bitcoin.entities[0]?.targetId || ''
  );
}
