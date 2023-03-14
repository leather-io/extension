import React, { useContext } from 'react';

import { AppContext } from '@common/context';
import { stacksTestnetNetwork } from '@common/utils';
import * as btc from '@scure/btc-signer';
import { bytesToHex, hexToBytes } from '@stacks/common';
import { PsbtData, PsbtRequestOptions } from '@stacks/connect';
import { useConnect } from '@stacks/connect-react';
import { StacksNetwork } from '@stacks/network';
import { Box, Button, Text } from '@stacks/ui';

interface BitcoinNetwork {
  bech32: string;
  pubKeyHash: number;
  scriptHash: number;
  wif: number;
}

const bitcoinTestnet: BitcoinNetwork = {
  bech32: 'tb',
  pubKeyHash: 0x6f,
  scriptHash: 0xc4,
  wif: 0xef,
};

const ecdsaPublicKeyLength = 33;

function ecdsaPublicKeyToSchnorr(pubKey: Uint8Array) {
  if (pubKey.byteLength !== ecdsaPublicKeyLength) throw new Error('Invalid public key length');
  return pubKey.slice(1);
}

function getTaprootPayment(publicKey: Uint8Array) {
  return btc.p2tr(ecdsaPublicKeyToSchnorr(publicKey), undefined, bitcoinTestnet);
}

function buildTestNativeSegwitPsbtRequest(pubKey: Uint8Array): PsbtRequestOptions {
  const p2wpkh = btc.p2wpkh(pubKey, bitcoinTestnet);

  const tx = new btc.Transaction();

  tx.addInput({
    index: 0,
    txid: '15f34b3bd2aab555a003cd1c6959ac09b36239c6af1cb16ff8198cef64f8db9c',
    witnessUtxo: {
      amount: BigInt(1000),
      script: p2wpkh.script,
    },
  });
  tx.addInput({
    index: 1,
    txid: 'dca5179afaa63eae112d8a97794de2d30dd823315bcabe6d8b8a6b98e3567705',
    witnessUtxo: {
      amount: BigInt(2000),
      script: p2wpkh.script,
    },
  });

  const psbt = tx.toPSBT();

  return { hex: bytesToHex(psbt) };
}

function buildTestNativeSegwitPsbtRequestWithIndexes(pubKey: Uint8Array): PsbtRequestOptions {
  const p2wpkh = btc.p2wpkh(pubKey, bitcoinTestnet);

  const tx = new btc.Transaction();

  tx.addInput({
    index: 0,
    txid: '15f34b3bd2aab555a003cd1c6959ac09b36239c6af1cb16ff8198cef64f8db9c',
    witnessUtxo: {
      amount: BigInt(1000),
      script: p2wpkh.script,
    },
  });
  tx.addInput({
    index: 1,
    txid: 'dca5179afaa63eae112d8a97794de2d30dd823315bcabe6d8b8a6b98e3567705',
    witnessUtxo: {
      amount: BigInt(2000),
      script: p2wpkh.script,
    },
  });

  const psbt = tx.toPSBT();

  return { signAtIndex: [0, 1], hex: bytesToHex(psbt) };
}

function buildTestTaprootPsbtRequest(pubKey: Uint8Array): PsbtRequestOptions {
  const payment = getTaprootPayment(pubKey);

  const tx = new btc.Transaction();

  tx.addInput({
    index: 0,
    tapInternalKey: payment.tapInternalKey,
    txid: '15f34b3bd2aab555a003cd1c6959ac09b36239c6af1cb16ff8198cef64f8db9c',
    witnessUtxo: {
      amount: BigInt(1000),
      script: payment.script,
    },
  });
  tx.addInput({
    index: 1,
    tapInternalKey: payment.tapInternalKey,
    txid: 'dca5179afaa63eae112d8a97794de2d30dd823315bcabe6d8b8a6b98e3567705',
    witnessUtxo: {
      amount: BigInt(2000),
      script: payment.script,
    },
  });

  const psbt = tx.toPSBT();

  return { hex: bytesToHex(psbt) };
}

function buildTestTaprootPsbtRequestWithIndex(pubKey: Uint8Array): PsbtRequestOptions {
  const payment = getTaprootPayment(pubKey);

  const tx = new btc.Transaction();

  tx.addInput({
    index: 0,
    tapInternalKey: payment.tapInternalKey,
    txid: '15f34b3bd2aab555a003cd1c6959ac09b36239c6af1cb16ff8198cef64f8db9c',
    witnessUtxo: {
      amount: BigInt(1000),
      script: payment.script,
    },
  });

  const psbt = tx.toPSBT();

  return { signAtIndex: 0, hex: bytesToHex(psbt) };
}

export const Bitcoin = () => {
  const { userData } = useContext(AppContext);
  const { signPsbt } = useConnect();
  const segwitPubKey = hexToBytes(userData?.profile.btcPublicKey.p2wpkh);
  const taprootPubKey = hexToBytes(userData?.profile.btcPublicKey.p2tr);

  console.log('userData', userData);

  const signTx = async (options: PsbtRequestOptions, network?: StacksNetwork) => {
    const defaultNetwork = stacksTestnetNetwork;

    await signPsbt({
      ...options,
      network: network ?? defaultNetwork,
      onFinish: (data: PsbtData) => {
        console.log('psbt', data);
      },
      onCancel: () => {
        console.log('popup closed!');
      },
    });
  };

  return (
    <Box py={6}>
      <Text as="h2" textStyle="display.small">
        Bitcoin
      </Text>
      <Text textStyle="body.large" display="block" my={'loose'}>
        Try testing Partially Signed Bitcoin Transactions.
      </Text>
      <Button
        mt={3}
        onClick={() => signTx(buildTestNativeSegwitPsbtRequest(segwitPubKey), stacksTestnetNetwork)}
      >
        Sign PSBT (Segwit)
      </Button>
      <Button
        ml={3}
        mt={3}
        onClick={() =>
          signTx(buildTestNativeSegwitPsbtRequestWithIndexes(segwitPubKey), stacksTestnetNetwork)
        }
      >
        Sign PSBT at indexes (SegWit)
      </Button>
      <Button
        ml={3}
        mt={3}
        onClick={() => signTx(buildTestTaprootPsbtRequest(taprootPubKey), stacksTestnetNetwork)}
      >
        Sign PSBT (Taproot)
      </Button>
      <Button
        ml={3}
        mt={3}
        onClick={() =>
          signTx(buildTestTaprootPsbtRequestWithIndex(taprootPubKey), stacksTestnetNetwork)
        }
      >
        Sign PSBT at index (Taproot)
      </Button>
    </Box>
  );
};
