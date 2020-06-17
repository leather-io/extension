import { UserSession } from 'blockstack';
import { AuthOptions } from '../auth';

export interface TxBase {
  appDetails?: AuthOptions['appDetails'];
}

export interface FinishedTxData {
  txId: string;
  txRaw: string;
}

export enum TransactionTypes {
  ContractCall = 'contract_call',
  ContractDeploy = 'smart_contract',
  STXTransfer = 'token_transfer',
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
  txType: TransactionTypes.ContractCall;
  publicKey: string;
}

/**
 * Contract Deploy
 */
export interface ContractDeployBase extends TxBase {
  contractName: string;
  codeBody: string;
}

export interface ContractDeployOptions extends ContractDeployBase {
  authOrigin?: string;
  userSession?: UserSession;
  finished?: (data: FinishedTxData) => void;
}

export interface ContractDeployPayload extends ContractDeployOptions {
  publicKey: string;
  txType: TransactionTypes.ContractDeploy;
}

/**
 * STX Transfer
 */

export interface STXTransferBase extends TxBase {
  recipient: string;
  amount: string;
  memo?: string;
}

export interface STXTransferOptions extends STXTransferBase {
  authOrigin?: string;
  userSession?: UserSession;
  finished?: (data: FinishedTxData) => void;
}

export interface STXTransferPayload extends STXTransferOptions {
  publicKey: string;
  txType: TransactionTypes.STXTransfer;
}

/**
 * Transaction Popup
 */

export type TransactionOptions = ContractCallOptions | ContractDeployOptions | STXTransferOptions;
export type TransactionPayload = ContractCallPayload | ContractDeployPayload | STXTransferPayload;

export interface TransactionPopup {
  token: string;
  opts: TransactionOptions;
}
