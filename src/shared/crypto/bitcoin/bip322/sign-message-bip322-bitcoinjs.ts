import { base64 } from '@scure/base';
import * as btc from '@scure/btc-signer';
import * as bitcoin from 'bitcoinjs-lib';

import { BitcoinNetworkModes } from '@shared/constants';

import { getBitcoinJsLibNetworkConfigByMode } from '../bitcoin.network';
import {
  bip322TransactionToSignValues,
  ecPairFromPrivateKey,
  encodeMessageWitnessData,
  hashBip322Message,
  tweakSigner,
} from './bip322-utils';

export function createNativeSegwitBitcoinJsSigner(privateKey: Buffer) {
  return ecPairFromPrivateKey(privateKey);
}

export function createTaprootBitcoinJsSigner(privateKey: Buffer) {
  return tweakSigner(ecPairFromPrivateKey(privateKey));
}

export function createToSpendTx(address: string, message: string, network: BitcoinNetworkModes) {
  const { prevoutHash, prevoutIndex, sequence } = bip322TransactionToSignValues;

  const script = bitcoin.address.toOutputScript(
    address,
    getBitcoinJsLibNetworkConfigByMode(network)
  );

  const hash = hashBip322Message(message);
  const commands = [0, Buffer.from(hash)];
  const scriptSig = bitcoin.script.compile(commands);

  const virtualToSpend = new bitcoin.Transaction();
  virtualToSpend.version = 0;
  virtualToSpend.addInput(Buffer.from(prevoutHash), prevoutIndex, sequence, scriptSig);
  virtualToSpend.addOutput(script, 0);
  return { virtualToSpend, script };
}

function createToSignTx(toSpendTxHex: Buffer, script: Buffer, network: BitcoinNetworkModes) {
  const virtualToSign = new bitcoin.Psbt({ network: getBitcoinJsLibNetworkConfigByMode(network) });
  virtualToSign.setVersion(0);
  const prevTxHash = toSpendTxHex;
  const prevOutIndex = 0;
  const toSignScriptSig = bitcoin.script.compile([bitcoin.script.OPS.OP_RETURN]);

  virtualToSign.addInput({
    hash: prevTxHash,
    index: prevOutIndex,
    sequence: 0,
    witnessUtxo: { script, value: 0 },
  });

  virtualToSign.addOutput({ script: toSignScriptSig, value: 0 });
  return virtualToSign;
}

interface SignBip322MessageSimple {
  address: string;
  message: string;
  network: BitcoinNetworkModes;
  signPsbt(psbt: bitcoin.Psbt): Promise<btc.Transaction>;
}
export async function signBip322MessageSimple(args: SignBip322MessageSimple) {
  const { address, message, network, signPsbt } = args;

  const { virtualToSpend, script } = createToSpendTx(address, message, network);

  const virtualToSign = createToSignTx(virtualToSpend.getHash(), script, network);

  const signedTx = await signPsbt(virtualToSign);

  const asBitcoinJsTransaction = bitcoin.Psbt.fromBuffer(Buffer.from(signedTx.toPSBT()));

  asBitcoinJsTransaction.finalizeInput(0);

  // sign the tx
  // section 5.1
  // github.com/LegReq/bip0322-signatures/blob/master/BIP0322_signing.ipynb
  const toSignTx = asBitcoinJsTransaction.extractTransaction();

  const result = encodeMessageWitnessData(toSignTx.ins[0].witness);

  return {
    virtualToSpend,
    virtualToSign: toSignTx,
    unencodedSig: result,
    signature: base64.encode(result),
  };
}
