import { useCallback } from 'react';

import { ContractCallPayload } from '@stacks/connect';

import { StacksTransactionFormValues } from '@shared/models/form.model';

import {
  GenerateUnsignedTransactionOptions,
  generateUnsignedTransaction,
} from '@app/common/transactions/stacks/generate-unsigned-txs';
import { useNextNonce } from '@app/query/stacks/nonce/account-nonces.hooks';

import { useCurrentStacksAccount } from '../accounts/blockchain/stacks/stacks-account.hooks';
import { useCurrentStacksNetworkState } from '../networks/networks.hooks';

export function useGenerateStacksContractCallUnsignedTx() {
  const { data: nextNonce } = useNextNonce();
  const network = useCurrentStacksNetworkState();
  const account = useCurrentStacksAccount();

  return useCallback(
    async (payload: ContractCallPayload, values: StacksTransactionFormValues) => {
      if (!account) return;

      const options: GenerateUnsignedTransactionOptions = {
        publicKey: account.stxPublicKey,
        nonce: Number(values?.nonce) ?? nextNonce?.nonce,
        fee: values.fee ?? 0,
        txData: { ...payload, network },
      };
      return generateUnsignedTransaction(options);
    },
    [account, network, nextNonce?.nonce]
  );
}
