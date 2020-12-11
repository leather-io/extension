import { useState, useEffect, useCallback } from 'react';
import { useWallet } from './use-wallet';
import { useLocation } from 'react-router-dom';
import {
  contractSourceStore,
  contractInterfaceStore,
  pendingTransactionStore,
  signedTransactionStore,
  requestTokenStore,
  pendingTransactionFunctionSelector,
} from '@store/recoil/transaction';
import { useRecoilValue, useSetRecoilState, useRecoilValueLoadable } from 'recoil';

export const useTxState = () => {
  const location = useLocation();
  const { currentIdentity } = useWallet();
  const [error, setError] = useState<string | null>(null);
  const pendingTransaction = useRecoilValue(pendingTransactionStore);
  const contractSource = useRecoilValueLoadable(contractSourceStore);
  const contractInterface = useRecoilValueLoadable(contractInterfaceStore);
  const pendingTransactionFunction = useRecoilValueLoadable(pendingTransactionFunctionSelector);
  const signedTransaction = useRecoilValueLoadable(
    signedTransactionStore(currentIdentity.keyPair.key)
  );
  const requestToken = useRecoilValue(requestTokenStore);
  const setRequestToken = useSetRecoilState(requestTokenStore);

  if (!currentIdentity) {
    throw new Error('User must be logged in.');
  }

  const decodeRequest = useCallback(() => {
    const urlParams = new URLSearchParams(location.search);
    const _requestToken = urlParams.get('request');
    if (_requestToken) {
      setRequestToken(_requestToken);
    } else if (!requestToken) {
      setError('Unable to decode request');
      console.error('Unable to find contract call parameter');
    }
  }, [location.search, setRequestToken, requestToken]);

  useEffect(() => {
    decodeRequest();
  }, [decodeRequest]);

  return {
    pendingTransaction,
    signedTransaction,
    contractSource,
    error,
    contractInterface,
    pendingTransactionFunction,
  };
};
