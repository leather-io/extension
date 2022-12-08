import { useCallback } from 'react';

import {
  ChainID,
  ClarityType,
  ClarityValue,
  TupleCV,
  createStacksPrivateKey,
  cvToString,
  encodeStructuredData,
} from '@stacks/transactions';
import { sha256 } from 'sha.js';

import { signMessage, signStructuredDataMessage } from '@shared/crypto/sign-message';
import { SignedMessageStructured } from '@shared/signature/signature-types';
import { isString } from '@shared/utils';

import { whenStxChainId } from '@app/common/utils';
import { useCurrentAccount } from '@app/store/accounts/account.hooks';

export function useMessageSignerSoftwareWallet() {
  const account = useCurrentAccount();
  return useCallback(
    ({ message, domain }: { message: string | ClarityValue; domain?: TupleCV }) => {
      if (!account || account.type === 'ledger') return null;
      const privateKey = createStacksPrivateKey(account.stxPrivateKey);
      if (isString(message)) {
        return signMessage(message, privateKey);
      } else {
        if (!domain) throw new Error('Domain is required for structured messages');
        // returns signature in RSV format
        return signStructuredDataMessage(message, domain, privateKey);
      }
    },
    [account]
  );
}

export function cvToDisplay(cv: ClarityValue): string {
  return cvToString(cv).replaceAll('"', '');
}

export function chainIdToDisplay(chainIdCv: ClarityValue): string {
  if (chainIdCv.type !== ClarityType.UInt) return '';
  const chainIdString = cvToString(chainIdCv);
  const chainId = parseInt(chainIdString.replace('u', ''));
  if (!Object.values(ChainID).includes(chainId)) return '';

  return whenStxChainId(chainId as ChainID)({
    [ChainID.Testnet]: 'Testnet',
    [ChainID.Mainnet]: 'Mainnet',
  });
}

export function deriveStructuredMessageHash({
  domain,
  message,
}: Omit<SignedMessageStructured, 'messageType'>) {
  return new sha256().update(encodeStructuredData({ message, domain })).digest('hex');
}
