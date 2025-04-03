import { bytesToHex } from '@stacks/common';
import {
  CommonSignaturePayload as ConnectCommonSignaturePayload,
  ContractCallPayload as ConnectContractCallPayload,
  ContractDeployPayload as ConnectContractDeployPayload,
  ProfileUpdatePayload as ConnectProfileUpdatePayload,
  STXTransferPayload as ConnectSTXTransferPayload,
} from '@stacks/connect-jwt';
import type { StacksNetwork } from '@stacks/network';
import {
  Address,
  Cl,
  type ClarityValue,
  type PostCondition,
  type PostConditionWire,
} from '@stacks/transactions';
import {
  ClarityType as LegacyClarityType,
  ClarityValue as LegacyClarityValue,
  PostCondition as LegacyPostCondition,
  serializePostCondition as legacySerializePostCondition,
} from '@stacks/transactions-v6';
import { decodeToken } from 'jsontokens';

import type { ReplaceTypes } from '@leather.io/models';
import type { TransactionTypes } from '@leather.io/stacks';

// This file exists to support legacy requests and type inconsistencies from @stacks/connect

export type ContractCallPayload = ReplaceTypes<
  ConnectContractCallPayload,
  {
    txType: TransactionTypes.ContractCall;
    network: StacksNetwork;
    postConditions?: PostCondition[] | PostConditionWire[];
  }
>;
export type ContractDeployPayload = ReplaceTypes<
  ConnectContractDeployPayload,
  {
    txType: TransactionTypes.ContractDeploy;
    network: StacksNetwork;
    postConditions?: PostCondition[] | PostConditionWire[];
  }
>;
export type STXTransferPayload = ReplaceTypes<
  ConnectSTXTransferPayload,
  {
    txType: TransactionTypes.StxTokenTransfer;
    network: StacksNetwork;
    postConditions?: PostCondition[] | PostConditionWire[];
  }
>;
export type ProfileUpdatePayload = ReplaceTypes<
  ConnectProfileUpdatePayload,
  {
    network: StacksNetwork;
  }
>;
export type CommonSignaturePayload = ReplaceTypes<
  ConnectCommonSignaturePayload,
  {
    network: StacksNetwork;
  }
>;
export interface SignaturePayload extends CommonSignaturePayload {
  message: string;
}
export type TransactionPayload = ContractCallPayload | ContractDeployPayload | STXTransferPayload;

export function getLegacyTransactionPayloadFromToken(requestToken: string) {
  const token = decodeToken(requestToken);
  return token.payload as unknown as TransactionPayload;
}

export function legacyCVToCV(cv: LegacyClarityValue): ClarityValue {
  if (typeof cv.type === 'string') return cv;

  switch (cv.type) {
    case LegacyClarityType.BoolFalse:
      return Cl.bool(false);
    case LegacyClarityType.BoolTrue:
      return Cl.bool(true);
    case LegacyClarityType.Int:
      return Cl.int(cv.value);
    case LegacyClarityType.UInt:
      return Cl.uint(cv.value);
    case LegacyClarityType.Buffer:
      return Cl.buffer(cv.buffer);
    case LegacyClarityType.StringASCII:
      return Cl.stringAscii(cv.data);
    case LegacyClarityType.StringUTF8:
      return Cl.stringUtf8(cv.data);
    case LegacyClarityType.List:
      return Cl.list(cv.list.map(legacyCVToCV));
    case LegacyClarityType.Tuple:
      return Cl.tuple(
        Object.fromEntries(Object.entries(cv.data).map(([k, v]) => [k, legacyCVToCV(v)]))
      );
    case LegacyClarityType.OptionalNone:
      return Cl.none();
    case LegacyClarityType.OptionalSome:
      return Cl.some(legacyCVToCV(cv.value));
    case LegacyClarityType.ResponseErr:
      return Cl.error(legacyCVToCV(cv.value));
    case LegacyClarityType.ResponseOk:
      return Cl.ok(legacyCVToCV(cv.value));
    case LegacyClarityType.PrincipalContract:
      return Cl.contractPrincipal(Address.stringify(cv.address), cv.contractName.content);
    case LegacyClarityType.PrincipalStandard:
      return Cl.standardPrincipal(Address.stringify(cv.address));
    default:
      const _exhaustiveCheck: never = cv;
      throw new Error(`Unknown clarity type: ${_exhaustiveCheck}`);
  }
}

export function serializeLegacyPostCondition(pcs: LegacyPostCondition[]) {
  return pcs.map(pc => {
    return bytesToHex(legacySerializePostCondition(pc));
  });
}
