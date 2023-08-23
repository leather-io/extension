import { address as bitcoinAddress } from 'bitcoinjs-lib';
import { bytesToHex } from 'micro-stacks/common';

import { getScriptHash } from '../htlc';
import { getBitcoinNetwork } from '../network';

import type { MagicFetchElectrumContext } from './constants';

export async function fetchBtcBalance(
  address: string,
  { electrumClient, network }: MagicFetchElectrumContext
) {
  const output = bitcoinAddress.toOutputScript(address, getBitcoinNetwork(network));
  const scriptHash = getScriptHash(output);

  const balances = await electrumClient.blockchain_scripthash_getBalance(bytesToHex(scriptHash));
  const balance = BigInt(balances.unconfirmed) + BigInt(balances.confirmed);

  return balance;
}
