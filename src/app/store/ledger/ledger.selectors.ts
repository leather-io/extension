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
