import { useSelector } from 'react-redux';

import { createSelector } from '@reduxjs/toolkit';

import { sumNumbers } from '@app/common/math/helpers';

import { RootState } from '..';

const selectLedger = (state: RootState) => state.ledger;

const selectNumberOfLedgerKeysPersisted = createSelector(selectLedger, ledger =>
  sumNumbers(Object.values(ledger).map(chain => Object.keys(chain.entities).length))
);

export function useNumberOfLedgerKeysPersisted() {
  return useSelector(selectNumberOfLedgerKeysPersisted);
}

export function useHasLedgerKeys() {
  return useNumberOfLedgerKeysPersisted().isGreaterThan(0);
}

export function useLedgerDeviceTargetId() {
  return useSelector(
    (state: RootState) => state.ledger.stacks.targetId || state.ledger.bitcoin.targetId
  );
}
