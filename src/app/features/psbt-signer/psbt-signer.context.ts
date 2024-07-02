import { createContext, useContext } from 'react';

import type { Inscription, Money } from '@leather.io/models';

import { PsbtInput } from './hooks/use-parsed-inputs';
import { PsbtOutput } from './hooks/use-parsed-outputs';

export interface PsbtSignerContext {
  accountInscriptionsBeingTransferred: Inscription[];
  accountInscriptionsBeingReceived: Inscription[];
  addressNativeSegwit: string;
  addressTaproot: string;
  addressNativeSegwitTotal: Money;
  addressTaprootTotal: Money;
  fee: Money;
  isPsbtMutable: boolean;
  psbtInputs: PsbtInput[];
  psbtOutputs: PsbtOutput[];
  shouldDefaultToAdvancedView: boolean;
}

const psbtSignerContext = createContext<PsbtSignerContext | null>(null);

export function usePsbtSignerContext() {
  const context = useContext(psbtSignerContext);
  if (!context) throw new Error('No PsbtSignerContext found');
  return context;
}

export const PsbtSignerProvider = psbtSignerContext.Provider;
