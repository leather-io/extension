import { useMemo, useState } from 'react';
import toast from 'react-hot-toast';

import { RpcErrorCode } from '@btckit/types';
import * as bitcoin from 'bitcoinjs-lib';

import {
  createNativeSegwitBitcoinJsSigner,
  createTaprootBitcoinJsSigner,
  signBip322MessageSimple,
} from '@shared/crypto/bitcoin/bip322/sign-message-bip322-bitcoinjs';
import { deriveAddressIndexZeroFromAccount } from '@shared/crypto/bitcoin/bitcoin.utils';
import { logger } from '@shared/logger';
import { makeRpcErrorResponse, makeRpcSuccessResponse } from '@shared/rpc/rpc-methods';

import { useAnalytics } from '@app/common/hooks/analytics/use-analytics';
import { useDefaultRequestParams } from '@app/common/hooks/use-default-request-search-params';
import { initialSearchParams } from '@app/common/initial-search-params';
import { createDelay } from '@app/common/utils';
import {
  useCurrentAccountNativeSegwitSigner,
  useNativeSegwitCurrentAccountPrivateKeychain,
} from '@app/store/accounts/blockchain/bitcoin/native-segwit-account.hooks';
import {
  useCurrentAccountTaprootSigner,
  useCurrentTaprootAccountKeychain,
} from '@app/store/accounts/blockchain/bitcoin/taproot-account.hooks';
import { useCurrentNetwork } from '@app/store/networks/networks.selectors';

function useRpcSignBitcoinMessage() {
  const defaultParams = useDefaultRequestParams();
  return useMemo(
    () => ({
      ...defaultParams,
      requestId: initialSearchParams.get('requestId') ?? '',
      message: initialSearchParams.get('message') ?? '',
      paymentType: initialSearchParams.get('paymentType') ?? 'p2wpkh',
    }),
    [defaultParams]
  );
}

const shortPauseBeforeToast = createDelay(250);
const allowTimeForUserToReadToast = createDelay(1200);

export function useSignBip322Message() {
  const network = useCurrentNetwork();
  const analytics = useAnalytics();
  const [isLoading, setIsLoading] = useState(false);

  const { tabId, origin, requestId, message, paymentType } = useRpcSignBitcoinMessage();

  const createNativeSegwitSigner = useCurrentAccountNativeSegwitSigner();
  const createTaprootSigner = useCurrentAccountTaprootSigner();

  const currentAccountNativeSegwitKeychain = useNativeSegwitCurrentAccountPrivateKeychain();

  if (!currentAccountNativeSegwitKeychain) throw new Error('No keychain for current account');
  const nativeSegwitIndexZeroKeychain = deriveAddressIndexZeroFromAccount(
    currentAccountNativeSegwitKeychain
  );

  const currentAccountTaprootKeychain = useCurrentTaprootAccountKeychain();
  const taprootIndexZeroKeychain = deriveAddressIndexZeroFromAccount(
    currentAccountTaprootKeychain!
  );

  return {
    origin,
    message,
    isLoading,
    formattedOrigin: new URL(origin ?? '').host,
    onUserRejectBip322MessageSigningRequest() {
      if (!tabId) return;
      chrome.tabs.sendMessage(
        tabId,
        makeRpcErrorResponse('signMessage', {
          id: requestId,
          error: {
            code: RpcErrorCode.USER_REJECTION,
            message: 'User rejected message signing request',
          },
        })
      );
      window.close();
    },
    async onUserApproveBip322MessageSigningRequest() {
      setIsLoading(true);
      const nativeSegwitSigner = createNativeSegwitSigner?.(0);
      const taprootSigner = createTaprootSigner?.(0);

      if (!tabId || !origin) {
        logger.error('Cannot give app accounts: missing tabId, origin');
        return;
      }

      void analytics.track('user_approved_message_signing', { origin });

      switch (paymentType) {
        case 'p2wpkh': {
          const nativeSegwitAddress = nativeSegwitSigner?.payment.address;
          if (!nativeSegwitAddress) throw new Error('Cannot sign message: no address');

          function signPsbt(psbt: bitcoin.Psbt) {
            psbt.signAllInputs(
              createNativeSegwitBitcoinJsSigner(
                Buffer.from(nativeSegwitIndexZeroKeychain?.privateKey!)
              )
            );
          }

          const { signature } = signBip322MessageSimple({
            message,
            address: nativeSegwitAddress,
            signPsbt,
            network: network.chain.bitcoin.network,
          });

          chrome.tabs.sendMessage(
            tabId,
            makeRpcSuccessResponse('signMessage', {
              id: requestId,
              result: { signature, address: nativeSegwitAddress } as any,
            })
          );
          break;
        }
        case 'p2tr': {
          function signPsbt(psbt: bitcoin.Psbt) {
            psbt.data.inputs.forEach(
              input => (input.tapInternalKey = Buffer.from(taprootSigner?.payment.tapInternalKey!))
            );
            psbt.signAllInputs(
              createTaprootBitcoinJsSigner(Buffer.from(taprootIndexZeroKeychain?.privateKey!))
            );
          }
          const { signature } = signBip322MessageSimple({
            message,
            address: taprootSigner?.payment.address!,
            signPsbt,
            network: network.chain.bitcoin.network,
          });

          chrome.tabs.sendMessage(
            tabId,
            makeRpcSuccessResponse('signMessage', {
              id: requestId,
              result: { signature, address: taprootSigner?.payment.address! } as any,
            })
          );
        }
      }

      await shortPauseBeforeToast();
      toast.success('Message signed successfully');
      await allowTimeForUserToReadToast();
      window.close();
    },
  };
}
