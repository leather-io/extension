import * as btc from '@scure/btc-signer';
import { hexToBytes } from '@stacks/common';

import { hashBip322Message } from './bip322-utils';

// TODO: Complete this fn
// Ran into difficiulties with btc-signer vs bitcoinjs-lib
// Using that library to unblock for now, but we should go
// back and replace it when possible.
// ts-unused-exports:disable-next-line
export function signBip322MessageSimple(script: Uint8Array, message: string) {
  // nVersion = 0
  // nLockTime = 0
  // vin[0].prevout.hash = 0000...000
  // vin[0].prevout.n = 0xFFFFFFFF
  // vin[0].nSequence = 0
  // vin[0].scriptSig = OP_0 PUSH32[ message_hash ]
  // vin[0].scriptWitness = []
  // vout[0].nValue = 0
  // vout[0].scriptPubKey = message_challenge

  const prevoutHash = hexToBytes(
    '0000000000000000000000000000000000000000000000000000000000000000'
  );
  const prevoutIndex = 0xffffffff;
  const sequence = 0;

  const hash = hashBip322Message(message);

  const commands = [btc.OP.OP_0, hash];

  const virtualToSpend = new btc.Transaction({
    version: 0,
    lockTime: 0,
    allowUnknowInput: true,
    allowUnknowOutput: true,
    disableScriptCheck: true,
    allowLegacyWitnessUtxo: true,
  });

  virtualToSpend.addInput({
    txid: prevoutHash,
    index: prevoutIndex,
    sequence,
    witnessScript: btc.Script.encode(commands),
  });

  virtualToSpend.addOutput({
    script,
    amount: 0n,
  });

  return { virtualToSpend };
}
