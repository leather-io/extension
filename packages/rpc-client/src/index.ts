import BN from 'bn.js';

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
