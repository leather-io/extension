import { useEffect, useState } from 'react';

import { bytesToHex } from '@stacks/common';
import { StacksTransaction } from '@stacks/transactions';
import axios from 'axios';

import { FeeTypes, type Fees } from '@leather.io/models';
import { type NextNonce } from '@leather.io/query';

import { logger } from '@shared/logger';

import { generateUnsignedTransaction } from '@app/common/transactions/stacks/generate-unsigned-txs';
import { useCurrentStacksAccountAddress } from '@app/store/accounts/blockchain/stacks/stacks-account.hooks';

interface TransactionBase {
  options: any;
  transaction: StacksTransaction | undefined;
}

interface SbtcSponsorshipVerificationResult {
  isVerifying: boolean;
  result: SbtcSponsorshipEligibility | undefined;
}

export interface SbtcSponsorshipEligibility {
  isEligible: boolean;
  unsignedSponsoredTx?: StacksTransaction;
}

interface SbtcSponsorshipSubmissionResult {
  txId?: string;
  error?: string;
}

export async function submitSponsoredSbtcTransaction(
  sponsoredTx: StacksTransaction
): Promise<SbtcSponsorshipSubmissionResult> {
  logger.debug('Submitting Sponsored sBTC Transaction!');
  try {
    const { data } = await axios.post('http://localhost:5001/submit', {
      tx: bytesToHex(sponsoredTx.serialize()),
    });
    logger.debug('sBTC Sponsorship Success:', data.txId);
    return {
      txId: data.txId,
    };
  } catch (error: any) {
    const errMsg = `sBTC Sponsorship Failure (${error?.response?.data?.error || 'Unknkown'})`;
    return {
      error: errMsg,
    };
  }
}

async function verifySponsoredSbtcTransaction(
  baseTx: TransactionBase,
  nextNonce: NextNonce,
  stxFees: Fees
): Promise<SbtcSponsorshipEligibility> {
  logger.debug('Verifying Sponsored sBTC Transaction!');
  try {
    // use the standard recommended fee
    const standardFee = stxFees.estimates[FeeTypes.Middle].fee.amount.toNumber();
    // add sponsorship option
    const { options } = baseTx as any;
    options.txData.sponsored = true;
    const sponsoredTx = await generateUnsignedTransaction({
      ...options,
      fee: standardFee,
      nonce: nextNonce?.nonce,
    });
    const serializedTx = bytesToHex(sponsoredTx.serialize());
    logger.debug('Pre-serialization:', {
      fee: sponsoredTx.auth.spendingCondition?.fee,
      authType: sponsoredTx.auth.authType,
      rawTx: serializedTx,
    });

    const { data } = await axios.post('http://localhost:5001/verify', {
      tx: serializedTx,
    });

    logger.debug('Verification response:', data);
    return { isEligible: true, unsignedSponsoredTx: sponsoredTx };
  } catch (error) {
    logger.error('Transaction verification failed:', error);
    return { isEligible: false };
  }
}

export function useCheckSbtcSponsorshipEligible(
  baseTx?: TransactionBase,
  nextNonce?: any,
  stxFees?: Fees
): SbtcSponsorshipVerificationResult {
  const [isLoading, setIsLoading] = useState(true);
  const [result, setResult] = useState<SbtcSponsorshipEligibility | undefined>();
  const stxAddress = useCurrentStacksAccountAddress();
  const [lastAddressChecked, setLastAddressChecked] = useState<string | undefined>();

  useEffect(() => {
    if (!(baseTx && nextNonce && stxFees)) {
      return;
    }
    if (result && stxAddress === lastAddressChecked) {
      return;
    }
    verifySponsoredSbtcTransaction(baseTx, nextNonce, stxFees)
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
  }, [baseTx, nextNonce, stxFees, result, stxAddress, lastAddressChecked]);

  return {
    isVerifying: isLoading,
    result,
  };
}
