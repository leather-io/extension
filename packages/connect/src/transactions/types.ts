import { UserSession } from 'blockstack';
import { AuthOptions } from '../auth';

export interface TxBase {
  appDetails?: AuthOptions['appDetails'];
}

export interface FinishedTxData {
  txId: string;
  txRaw: string;
}

/**
 * Contract Call
 */

export enum ContractCallArgumentType {
  BUFFER = 'buffer',
  UINT = 'uint',
  INT = 'int',
  PRINCIPAL = 'principal',
  BOOL = 'bool',
}

export interface ContractCallBase extends TxBase {
  contractAddress: string;
  contractName: string;
  functionName: string;
  functionArgs: ContractCallArgument[];
}

export interface ContractCallOptions extends ContractCallBase {
  authOrigin?: string;
  userSession?: UserSession;
  finished?: (data: FinishedTxData) => void;
}

export interface ContractCallArgument {
  type: ContractCallArgumentType;
  value: string;
}

export interface ContractCallPayload extends ContractCallBase {
  txType: 'contract-call';
  publicKey: string;
}

/**
 * Contract Deploy
 */
export interface ContractDeployBase extends TxBase {
  contractName: string;
  contractSource: string;
}

export interface ContractDeployOptions extends ContractDeployBase {
  authOrigin?: string;
  userSession?: UserSession;
  finished?: (data: FinishedTxData) => void;
}

export interface ContractDeployPayload extends ContractDeployOptions {
  publicKey: string;
  txType: 'contract-deploy';
}

/**
 * Transaction Popup
 */

export type TransactionOptions = ContractCallOptions | ContractDeployOptions;
export type TransactionPayload = ContractCallPayload | ContractDeployPayload;

export interface TransactionPopup {
  token: string;
  opts: TransactionOptions;
}
