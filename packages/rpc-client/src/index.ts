import BN from 'bn.js';
import { serializeCV, ClarityValue } from '@blockstack/stacks-transactions';

const baseURL = 'http://127.0.0.1:9000';
const sidecarURL = 'http://localhost:3999';

export interface Account {
  balance: BN;
  nonce: number;
}

export const toBN = (hex: string) => {
  return new BN(hex.slice(2), 16);
};

export const fetchAccount = async (principal: string): Promise<Account> => {
  // const url = `${baseURL}/v2/accounts/${principal}?proof=0`;
  const url = `${baseURL}/v2/accounts/${principal}`;
  const response = await fetch(url, {
    credentials: 'omit',
  });
  const data = await response.json();
  return {
    balance: toBN(data.balance),
    nonce: data.nonce,
  };
};

export const broadcastTX = async (hex: Buffer) => {
  const url = `${sidecarURL}/debug/v2/transactions`;
  const response = await fetch(url, {
    method: 'POST',
    credentials: 'omit',
    headers: {
      'Content-Type': 'application/octet-stream',
    },
    // body: new Blob([hex], { type: 'application/octet-stream' }),
    body: hex,
    // body: hex.toString('hex'),
  });
  return response;
};

interface FetchContractInterface {
  contractAddress: string;
  contractName: string;
}

interface BufferArg {
  buffer: {
    length: number;
  };
}

export interface ContractInterfaceFunctionArg {
  name: string;
  type: string | BufferArg;
}

export interface ContractInterfaceFunction {
  name: string;
  access: 'public' | 'private' | 'read_only';
  args: ContractInterfaceFunctionArg[];
}

export interface ContractInterface {
  functions: ContractInterfaceFunction[];
}

export const fetchContractInterface = async ({
  contractAddress,
  contractName,
}: FetchContractInterface) => {
  const url = `${baseURL}/v2/contracts/interface/${contractAddress}/${contractName}`;
  const response = await fetch(url);
  const contractInterface: ContractInterface = await response.json();
  return contractInterface;
};

interface CallReadOnly extends FetchContractInterface {
  args: ClarityValue[];
  functionName: string;
}

export const callReadOnly = async ({
  contractName,
  contractAddress,
  functionName,
  args,
}: CallReadOnly) => {
  const url = `${baseURL}/v2/contracts/call-read/${contractAddress}/${contractName}/${functionName}`;
  const argsStrings = args.map(arg => {
    return `0x${serializeCV(arg).toString('hex')}`;
  });
  const body = {
    sender: 'SP31DA6FTSJX2WGTZ69SFY11BH51NZMB0ZW97B5P0',
    arguments: argsStrings,
  };
  console.log(body);
  const response = await fetch(url, {
    method: 'POST',
    body: JSON.stringify(body),
    headers: {
      'Content-Type': 'application/json',
    },
  });
  const data = await response.json();
  console.log(data);
  return data;
};
