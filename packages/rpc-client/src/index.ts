import BN from 'bn.js';
import fetch from 'cross-fetch';

const baseURL = 'http://127.0.0.1:9000';

interface Account {
  balance: BN;
  nonce: number;
}

export const toBN = (hex: string) => {
  return new BN(hex.slice(2), 16);
};

export const fetchAccount = async (principal: string): Promise<Account> => {
  const url = `${baseURL}/v2/accounts/${principal}?proof=0`;
  const response = await fetch(url);
  const data = await response.json();
  return {
    balance: toBN(data.balance),
    nonce: data.nonce,
  };
};
