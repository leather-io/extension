import { sha256 } from '@noble/hashes/sha256';
import { bytesToHex } from '@stacks/common';
import {
  ChainID,
  ClarityType,
  ClarityValue,
  cvToString,
  encodeStructuredData,
} from '@stacks/transactions';

import { UnsignedMessageStructured } from '@shared/signature/signature-types';

import { whenStacksChainId } from '@app/common/utils';

export function cvToDisplay(cv: ClarityValue): string {
  return cvToString(cv).replaceAll('"', '');
}

export function chainIdToDisplay(chainIdCv: ClarityValue): string {
  if (chainIdCv.type !== ClarityType.UInt) return '';
  const chainIdString = cvToString(chainIdCv);
  const chainId = parseInt(chainIdString.replace('u', ''));
  if (!Object.values(ChainID).includes(chainId)) return '';

  return whenStacksChainId(chainId as ChainID)({
    [ChainID.Testnet]: 'Testnet',
    [ChainID.Mainnet]: 'Mainnet',
  });
}

export function deriveStructuredMessageHash({
  domain,
  message,
}: Omit<UnsignedMessageStructured, 'messageType'>) {
  return bytesToHex(sha256(encodeStructuredData({ message, domain })));
}
