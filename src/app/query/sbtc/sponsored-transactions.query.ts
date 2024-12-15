import { bytesToHex } from '@stacks/common';
import { StacksTransaction } from '@stacks/transactions';
import axios from 'axios';

import { FeeTypes, type Fees } from '@leather.io/models';
import { defaultStacksFees } from '@leather.io/query';

import { logger } from '@shared/logger';

import { generateUnsignedTransaction } from '@app/common/transactions/stacks/generate-unsigned-txs';

export interface TransactionBase {
  options?: any;
  transaction: StacksTransaction | undefined;
}

export interface SbtcSponsorshipVerificationResult {
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
    const errMsg = `sBTC Sponsorship Failure (${error?.response?.data?.error || 'Unknown'})`;
    return {
      error: errMsg,
    };
  }
}

interface VerifySponsoredSbtcTransactionArgs {
  baseTx: TransactionBase;
  nonce?: number;
  stxFees?: Fees;
}
export async function verifySponsoredSbtcTransaction({
  baseTx,
  nonce,
  stxFees,
}: VerifySponsoredSbtcTransactionArgs): Promise<SbtcSponsorshipEligibility> {
  logger.debug('Verifying Sponsored sBTC Transaction!');
  try {
    // use the standard recommended fee
    const standardFee =
      stxFees?.estimates[FeeTypes.Middle].fee.amount.toNumber() ??
      defaultStacksFees.estimates[FeeTypes.Middle].fee.amount.toNumber();
    // add sponsorship option
    const { options } = baseTx as any;
    options.txData.sponsored = true;
    const sponsoredTx = await generateUnsignedTransaction({
      ...options,
      fee: standardFee,
      nonce,
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
