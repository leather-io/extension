import { useEffect, useState } from 'react';

import type { Fees } from '@leather.io/models';

import { logger } from '@shared/logger';

import { useCurrentStacksAccountAddress } from '@app/store/accounts/blockchain/stacks/stacks-account.hooks';

import {
  type SbtcSponsorshipEligibility,
  type SbtcSponsorshipVerificationResult,
  type TransactionBase,
  verifySponsoredSbtcTransaction,
} from './sponsored-transactions.query';

export function useCheckSbtcSponsorshipEligible(
  baseTx?: TransactionBase,
  nonce?: number,
  stxFees?: Fees
): SbtcSponsorshipVerificationResult {
  const [isLoading, setIsLoading] = useState(true);
  const [result, setResult] = useState<SbtcSponsorshipEligibility | undefined>();
  const stxAddress = useCurrentStacksAccountAddress();
  const [lastAddressChecked, setLastAddressChecked] = useState<string | undefined>();

  useEffect(() => {
    if (!(baseTx && nonce && stxFees)) {
      return;
    }
    if (result && stxAddress === lastAddressChecked) {
      return;
    }
    verifySponsoredSbtcTransaction({ baseTx, nonce, stxFees })
      .then(result => {
        setResult(result);
        setLastAddressChecked(stxAddress);
      })
      .catch(e => {
        logger.error('Verification failure: ', e);
        setResult({ isEligible: false });
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [baseTx, stxFees, result, stxAddress, lastAddressChecked, nonce]);

  return {
    isVerifying: isLoading,
    result,
  };
}
