import { createContext } from 'react';

import { TransactionPayload } from '@stacks/connect';

export const stacksTransactionContext = createContext<TransactionPayload>(undefined as any);

export const StacksTransactionProvider = stacksTransactionContext.Provider;
