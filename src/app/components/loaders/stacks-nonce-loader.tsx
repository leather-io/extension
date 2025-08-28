import { createContext, useContext } from 'react';

import type { StacksTransactionWire } from '@stacks/transactions';
import z from 'zod';

import { isString } from '@leather.io/utils';

import { analytics } from '@shared/utils/analytics';

import { runOnce, serializeError } from '@app/common/utils';
import { useNextNonce } from '@app/query/stacks/nonce/account-nonces.hooks';
import { useCurrentStacksAccountAddress } from '@app/store/accounts/blockchain/stacks/stacks-account.hooks';

const nextNonceSchema = z.object({
  nonce: z.number(),
  nonceType: z.string(),
});

type NonceData = z.infer<typeof nextNonceSchema>;

const StacksNonceContext = createContext<NonceData | Record<string, unknown>>({});

// Do not consume nonce value from this hook
export function useAnalyticsOnlyStacksNonceTracker() {
  const context = useContext(StacksNonceContext);

  return {
    nonceCalculation: context ?? {},
    trackIfNonceError(unsignedTx: StacksTransactionWire, error: Error | string) {
      const txNonce = Number(unsignedTx.auth.spendingCondition.nonce);

      if (!('nonceType' in context)) return;
      if (isString(error)) return;

      const serializedError = serializeError(error);
      if ('name' in serializedError && serializedError.name === 'BadNonce') {
        const report = { ...serializedError, ...context, txNonce };
        if ('stack' in report) delete report.stack;
        void analytics.untypedTrack('investigation_bad_nonce_increase', report);
      }
    },
  };
}

const triggerIllegalAnalyticsEvent = runOnce(() =>
  analytics.untypedTrack('illegal_event_nonce_schema_fail')
);

interface StacksNonceLoaderProps {
  children(nonce: NonceData): React.ReactNode;
}
export function StacksNonceLoader({ children }: StacksNonceLoaderProps) {
  const stxAddress = useCurrentStacksAccountAddress();
  const { data: nextNonce } = useNextNonce(stxAddress);
  if (!nextNonce) return null;

  const schemaResult = nextNonceSchema.safeParse(nextNonce);
  if (!schemaResult.success) {
    triggerIllegalAnalyticsEvent();
    return null;
  }

  return (
    <StacksNonceContext.Provider value={schemaResult.data}>
      {children(schemaResult.data)}
    </StacksNonceContext.Provider>
  );
}
