import { useEffect, useState } from 'react';

import { FeeTypes, type Fees } from '@leather.io/models';

import { logger } from '@shared/logger';

import { useCurrentStacksAccountAddress } from '@app/store/accounts/blockchain/stacks/stacks-account.hooks';

import { useConfigSbtc } from '../common/remote-config/remote-config.query';
import { useNextNonce } from '../stacks/nonce/account-nonces.hooks';
import {
  type SbtcSponsorshipEligibility,
  type SbtcSponsorshipVerificationResult,
  type TransactionBase,
  verifySponsoredSbtcTransaction,
} from './sponsored-transactions.query';

interface UseCheckSbtcSponsorshipEligibleProps {
  baseTx?: TransactionBase;
  stxFees?: Fees;
}
export function useCheckSbtcSponsorshipEligible({
  baseTx,
  stxFees,
}: UseCheckSbtcSponsorshipEligibleProps): SbtcSponsorshipVerificationResult {
  const sbtcConfig = useConfigSbtc();
  const stxAddress = useCurrentStacksAccountAddress();
  const { data: nextNonce } = useNextNonce(stxAddress);
  const [isLoading, setIsLoading] = useState(true);
  const [result, setResult] = useState<SbtcSponsorshipEligibility | undefined>();
  const [lastAddressChecked, setLastAddressChecked] = useState<string | undefined>();

  useEffect(() => {
    if (!sbtcConfig.configLoading && !sbtcConfig.isSbtcSponsorshipsEnabled) {
      if (isLoading) setIsLoading(false);
      return;
    }
    if (!(sbtcConfig && baseTx && nextNonce && stxFees)) {
      return;
    }
    if (result && stxAddress === lastAddressChecked) {
      return;
    }

    verifySponsoredSbtcTransaction({
      apiUrl: sbtcConfig.sponsorshipApiUrl,
      baseTx,
      nonce: nextNonce.nonce,
      fee: stxFees.estimates[FeeTypes.Middle].fee.amount.toNumber(),
    })
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
  }, [baseTx, stxFees, result, stxAddress, lastAddressChecked, nextNonce, isLoading, sbtcConfig]);

  return {
    isVerifying: isLoading,
    result,
  };
}
