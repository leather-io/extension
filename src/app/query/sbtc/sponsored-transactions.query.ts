import { bytesToHex } from '@stacks/common';
import { StacksTransaction } from '@stacks/transactions';
import axios from 'axios';

import { logger } from '@shared/logger';

import { queryClient } from '@app/common/persistence';
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
  txid?: string;
  error?: string;
}

export async function submitSponsoredSbtcTransaction(
  apiUrl: string,
  sponsoredTx: StacksTransaction
): Promise<SbtcSponsorshipSubmissionResult> {
  try {
    const { data } = await axios.post(`${apiUrl}/submit`, {
      tx: bytesToHex(sponsoredTx.serialize()),
    });
    return {
      txid: data.txid,
    };
  } catch (error: any) {
    const errMsg = `sBTC Sponsorship Failure (${error?.response?.data?.error || 'Unknown'})`;
    return {
      error: errMsg,
    };
  }
}

interface VerifySponsoredSbtcTransactionArgs {
  apiUrl: string;
  baseTx: TransactionBase;
  nonce?: number;
  fee?: number;
}
export async function verifySponsoredSbtcTransaction({
  apiUrl,
  baseTx,
  nonce,
  fee,
}: VerifySponsoredSbtcTransactionArgs): Promise<SbtcSponsorshipEligibility> {
  try {
    // add sponsorship option
    const { options } = baseTx as any;
    options.txData.sponsored = true;
    const sponsoredTx = await generateUnsignedTransaction({
      ...options,
      fee,
      nonce,
    });
    const serializedTx = bytesToHex(sponsoredTx.serialize());

    const result = await queryClient.fetchQuery({
      queryKey: ['verify-sponsored-sbtc-transaction', serializedTx],
      queryFn: async () => {
        const { data } = await axios.post(
          `${apiUrl}/verify`,
          {
            tx: serializedTx,
          },
          { timeout: 5000 }
        );
        return data;
      },
    });

    return { isEligible: result, unsignedSponsoredTx: sponsoredTx };
  } catch (error) {
    logger.error('Transaction verification failed:', error);
    return { isEligible: false };
  }
}