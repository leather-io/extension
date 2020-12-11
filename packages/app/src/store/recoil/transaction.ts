import {
  TransactionVersion,
  StacksMainnet,
  StacksTestnet,
  PostCondition,
} from '@blockstack/stacks-transactions';
import { TransactionPayload, TransactionTypes } from '@stacks/connect';
import { decodeToken } from 'blockstack';
import { atom, selector, selectorFamily } from 'recoil';
import { WalletSigner } from '@stacks/keychain';
import { generateTransaction } from '@common/transaction-utils';
import { rpcClientStore, currentNetworkStore } from '@store/recoil/networks';

/** Transaction signing popup */

export const showTxDetails = atom<boolean>({
  key: 'transaction.show-details',
  default: true,
});

export const requestTokenStore = atom<string>({
  key: 'transaction.request-token',
  default: '',
  effects_UNSTABLE: [
    ({ setSelf, trigger }) => {
      if (trigger === 'get') {
        const search = location.hash.split('/transaction')[1];
        const urlParams = new URLSearchParams(search);
        const requestToken = urlParams.get('request');
        if (requestToken) {
          setSelf(requestToken);
        }
      }
    },
  ],
});

export const pendingTransactionStore = selector({
  key: 'transaction.pending-transaction',
  get: ({ get }) => {
    try {
      const token = decodeToken(get(requestTokenStore));
      const currentNetwork = get(currentNetworkStore);
      const tx = (token.payload as unknown) as TransactionPayload;
      const postConditions = get(postConditionsStore);
      tx.postConditions = [...postConditions];
      const network =
        tx.network?.version === TransactionVersion.Mainnet
          ? new StacksMainnet()
          : new StacksTestnet();
      network.coreApiUrl = currentNetwork.url;
      tx.network = network;
      return tx;
    } catch (error) {
      console.error('pending error', error.message);
      return undefined;
    }
  },
});

export const contractSourceStore = selector({
  key: 'transaction.contract-source',
  get: async ({ get }) => {
    const tx = get(pendingTransactionStore);
    const rpcClient = get(rpcClientStore);
    if (!tx) {
      return '';
    }
    if (tx.txType === TransactionTypes.ContractCall) {
      const source = await rpcClient.fetchContractSource({
        contractName: tx.contractName,
        contractAddress: tx.contractAddress,
      });
      return source;
    } else if (tx.txType === TransactionTypes.ContractDeploy) {
      return tx.codeBody;
    }
    return '';
  },
});

export const contractInterfaceStore = selector({
  key: 'transaction.contract-interface',
  get: async ({ get }) => {
    const tx = get(pendingTransactionStore);
    const rpcClient = get(rpcClientStore);
    if (!tx) {
      return undefined;
    }
    if (tx.txType === TransactionTypes.ContractCall) {
      const abi = await rpcClient.fetchContractInterface({
        contractName: tx.contractName,
        contractAddress: tx.contractAddress,
      });
      return abi;
    }
    return undefined;
  },
});

export const signedTransactionStore = selectorFamily({
  key: 'transaction.signedTransaction',
  get: (privateKey: string) => async ({ get }) => {
    const pendingTransaction = get(pendingTransactionStore);
    if (!pendingTransaction) {
      return undefined;
    }
    const signer = new WalletSigner({ privateKey });
    const tx = await generateTransaction({
      signer,
      txData: pendingTransaction,
    });
    return tx;
  },
  dangerouslyAllowMutability: true,
});

export const postConditionsStore = atom<PostCondition[]>({
  key: 'transaction.postConditions',
  default: [],
});

export const currentPostConditionIndexStore = atom<number | undefined>({
  key: 'transaction.currentPostConditionIndex',
  default: undefined,
});

export const currentPostConditionStore = selector<PostCondition | undefined>({
  key: 'transaction.currentPostCondition',
  get: ({ get }) => {
    const index = get(currentPostConditionIndexStore);
    if (index === undefined) {
      return undefined;
    }
    const postConditions = get(postConditionsStore);
    return postConditions[index];
  },
});
