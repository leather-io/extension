import { createContext, useContext, useState } from 'react';

import BigNumber from 'bignumber.js';
import type { FormikErrors } from 'formik';

import { HIGH_FEE_AMOUNT_STX } from '@leather.io/constants';
import { isEmpty } from '@leather.io/utils';

import type { HasChildren } from '@app/common/has-children';

interface StacksHighFeeWarningContext {
  showHighFeeWarningSheet: boolean;
  setShowHighFeeWarningSheet(val: boolean): void;
  hasBypassedFeeWarning: boolean;
  setHasBypassedFeeWarning(val: boolean): void;
  isHighFeeWithNoFormErrors(errors: FormikErrors<unknown>, fee: number | string): boolean;
}

const stacksHighFeeWarningContext = createContext<StacksHighFeeWarningContext | null>(null);

export function useStacksHighFeeWarningContext() {
  const ctx = useContext(stacksHighFeeWarningContext);
  if (!ctx) throw new Error(`stacksCommonSendFormContext must be used within a context`);
  return ctx;
}

const StacksHighFeeWarningProvider = stacksHighFeeWarningContext.Provider;

export function StacksHighFeeWarningContainer({ children }: HasChildren) {
  const [showHighFeeWarningSheet, setShowHighFeeWarningSheet] = useState(false);
  const [hasBypassedFeeWarning, setHasBypassedFeeWarning] = useState(false);

  function isHighFeeWithNoFormErrors(errors: FormikErrors<unknown>, fee: number | string) {
    if (hasBypassedFeeWarning) return false;
    return isEmpty(errors) && new BigNumber(fee).isGreaterThan(HIGH_FEE_AMOUNT_STX);
  }

  return (
    <StacksHighFeeWarningProvider
      value={{
        showHighFeeWarningSheet,
        setShowHighFeeWarningSheet,
        hasBypassedFeeWarning,
        setHasBypassedFeeWarning,
        isHighFeeWithNoFormErrors,
      }}
    >
      {children}
    </StacksHighFeeWarningProvider>
  );
}
