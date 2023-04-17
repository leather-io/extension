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
const TEST_TESTNET_ACCOUNT_1_PUBKEY_P2WPKH =
  '02b6b0afe5f620bc8e532b640b148dd9dea0ed19d11f8ab420fcce488fe3974893';
const TEST_TESTNET_ACCOUNT_1_PUBKEY_TR =
  '03cf7525b9d94fd35eaf6b4ac4c570f718d1df142606ba3a64e2407ea01a37778f';
const TEST_TESTNET_ACCOUNT_2_BTC_ADDRESS = 'tb1qkzvk9hr7uvas23hspvsgqfvyc8h4nngeqjqtnj';

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
    txid: '5be910a6557bae29b8ff2dbf4607dbf783eaf82802896d13f61d975c133ccce7',
    witnessUtxo: {
      amount: BigInt(1268294),
      script: p2wpkh.script,
    },
  });
  tx.addInput({
    index: 1,
    txid: '513bb27703148f97fbc2b7758ee314c14510a7ccd2b10cd8cb57366022fea8ab',
    witnessUtxo: {
      amount: BigInt(1000),
      script: p2wpkh.script,
    },
  });
  tx.addOutput({
    amount: BigInt(5000),
    script: p2wpkh.script,
  });

  const psbt = tx.toPSBT();

  return { hex: bytesToHex(psbt) };
}

function buildTestNativeSegwitPsbtRequestWithIndexes(pubKey: Uint8Array): PsbtRequestOptions {
  const p2wpkh = btc.p2wpkh(pubKey, bitcoinTestnet);

  const tx = new btc.Transaction();

  tx.addInput({
    index: 0,
    txid: '5be910a6557bae29b8ff2dbf4607dbf783eaf82802896d13f61d975c133ccce7',
    witnessUtxo: {
      amount: BigInt(1268294),
      script: p2wpkh.script,
    },
  });
  tx.addInput({
    index: 1,
    txid: '513bb27703148f97fbc2b7758ee314c14510a7ccd2b10cd8cb57366022fea8ab',
    witnessUtxo: {
      amount: BigInt(1000),
      script: p2wpkh.script,
    },
  });
  tx.addOutput({
    amount: BigInt(5000),
    script: p2wpkh.script,
  });

  const psbt = tx.toPSBT();

  return { signAtIndex: [0, 1], hex: bytesToHex(psbt) };
}

function buildTestTaprootPsbtRequest(pubKey: Uint8Array): PsbtRequestOptions {
  const payment = getTaprootPayment(pubKey);

  const tx = new btc.Transaction();

  tx.addInput({
    index: 0,
    txid: '4f4cc7cb40b04978bd7704798dc1adf55b58196cef616b0fac8181965abc4726',
    witnessUtxo: {
      amount: BigInt(1000),
      script: payment.script,
    },
  });
  tx.addOutput({
    amount: BigInt(1000),
    script: payment.script,
  });

  const psbt = tx.toPSBT();

  return { hex: bytesToHex(psbt) };
}

function buildTestTaprootPsbtRequestWithIndex(pubKey: Uint8Array): PsbtRequestOptions {
  const payment = getTaprootPayment(pubKey);

  const tx = new btc.Transaction();

  tx.addInput({
    index: 0,
    txid: '4f4cc7cb40b04978bd7704798dc1adf55b58196cef616b0fac8181965abc4726',
    witnessUtxo: {
      amount: BigInt(1000),
      script: payment.script,
    },
  });
  tx.addOutput({
    amount: BigInt(1000),
    script: payment.script,
  });

  const psbt = tx.toPSBT();

  return { signAtIndex: 0, hex: bytesToHex(psbt) };
}

export const Bitcoin = () => {
  const { userData } = useContext(AppContext);
  const { signPsbt } = useConnect();
  const segwitPubKey = hexToBytes(TEST_TESTNET_ACCOUNT_1_PUBKEY_P2WPKH);
  const taprootPubKey = hexToBytes(TEST_TESTNET_ACCOUNT_1_PUBKEY_TR);

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
        Bitcoin Testnet
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
      <Button
        mt={3}
        onClick={() => {
          console.log('requesting');
          window.btc
            ?.request('sendTransfer', {
              address: TEST_TESTNET_ACCOUNT_2_BTC_ADDRESS,
              amount: '10000',
            })
            .then(resp => {
              console.log({ sucesss: resp });
            })
            .catch(error => {
              console.log({ error });
            });
        }}
      >
        Send transfer
      </Button>
    </Box>
  );
};
