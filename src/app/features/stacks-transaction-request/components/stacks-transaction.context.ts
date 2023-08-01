import { createContext } from 'react';

import { TransactionPayload } from '@stacks/connect';

export const stacksTransactionContext = createContext<TransactionPayload | null>(null);

export const StacksTransactionProvider = stacksTransactionContext.Provider;
