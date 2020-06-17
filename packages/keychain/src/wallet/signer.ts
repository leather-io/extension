import {
  makeContractCall,
  makeContractDeploy,
  TransactionVersion,
  ClarityValue,
  StacksTestnet,
  makeSTXTokenTransfer,
  PostConditionMode,
  getAddressFromPrivateKey,
} from '@blockstack/stacks-transactions';
import RPCClient from '@blockstack/rpc-client';
import { bip32 } from 'bitcoinjs-lib';
import { assertIsTruthy } from '../utils';
import BN from 'bn.js';

interface ContractCallOptions {
  contractName: string;
  contractAddress: string;
  functionName: string;
  functionArgs: ClarityValue[];
  version: TransactionVersion;
  nonce: number;
}

interface ContractDeployOptions {
  contractName: string;
  codeBody: string;
  version: TransactionVersion;
  nonce: number;
}

interface STXTransferOptions {
  recipient: string;
  amount: string;
  memo?: string;
  nonce: number;
}

export class WalletSigner {
  privateKey: string;

  constructor({ privateKey }: { privateKey: string }) {
    this.privateKey = privateKey;
  }

  getSTXAddress(version: TransactionVersion) {
    return getAddressFromPrivateKey(this.getSTXPrivateKey(), version);
  }

  getSTXPrivateKey() {
    const node = bip32.fromBase58(this.privateKey);
    assertIsTruthy<Buffer>(node.privateKey);
    return node.privateKey;
  }

  async fetchAccount({
    version,
    rpcClient,
  }: {
    version: TransactionVersion;
    rpcClient: RPCClient;
  }) {
    const address = this.getSTXAddress(version);
    const account = await rpcClient.fetchAccount(address);
    return account;
  }

  async signContractCall({
    contractName,
    contractAddress,
    functionName,
    functionArgs,
    nonce,
  }: ContractCallOptions) {
    const tx = await makeContractCall({
      contractAddress,
      contractName,
      functionName,
      functionArgs,
      senderKey: this.getSTXPrivateKey().toString('hex'),
      fee: new BN(200),
      nonce: new BN(nonce),
      network: new StacksTestnet(),
      postConditionMode: PostConditionMode.Allow,
    });
    return tx;
  }

  async signContractDeploy({ contractName, codeBody, nonce }: ContractDeployOptions) {
    const tx = await makeContractDeploy({
      contractName,
      codeBody: codeBody,
      fee: new BN(2000),
      senderKey: this.getSTXPrivateKey().toString('hex'),
      network: new StacksTestnet(),
      nonce: new BN(nonce),
      postConditionMode: PostConditionMode.Allow,
    });
    return tx;
  }

  async signSTXTransfer({ recipient, amount, memo, nonce }: STXTransferOptions) {
    const tx = await makeSTXTokenTransfer({
      recipient,
      amount: new BN(amount),
      memo,
      fee: new BN(2000),
      senderKey: this.getSTXPrivateKey().toString('hex'),
      network: new StacksTestnet(),
      nonce: new BN(nonce),
      postConditionMode: PostConditionMode.Allow,
    });
    return tx;
  }
}
