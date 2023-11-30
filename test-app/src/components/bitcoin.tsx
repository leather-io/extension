import React, { useContext } from 'react';

import { AppContext } from '@common/context';
import { stacksTestnetNetwork } from '@common/utils';
import * as btc from '@scure/btc-signer';
import { bytesToHex, hexToBytes } from '@stacks/common';
import { PsbtData, PsbtRequestOptions } from '@stacks/connect';
import { useConnect } from '@stacks/connect-react';
import { StacksNetwork } from '@stacks/network';
import { Box, styled } from 'leather-styles/jsx';

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

// For testing sBTC w/ OP_RETURN in script
// const tempHex =
//   '70736274ff0100a00200000001782ba5d65b8551a99228b8d77e4989cf6ef6a197827d13b6d1dc3e8ba3d8e77f0100000000ffffffff0300000000000000001a6a1858323c1a7010183fd1a76976e7b2bb67acdf57cdfe704882dd89000000000000225120b8c8b0652cb2851a52374c7acd47181eb031e8fa5c62883f636e0d4fe695d6caecd70c000000000016001409c7efcd51a08da9b4e38345645866c2a270eb39000000000001011fb7700d00000000001600141c902345da2f93aa6045034c381a0f64684082de00000000';

const ecdsaPublicKeyLength = 33;
const TEST_TESTNET_ACCOUNT_1_PUBKEY_P2WPKH =
  '03fe21e3444109e30ff7d19da0f530c344cad2e35fbee89afb2413858e4a9d7aa5';
const TEST_TESTNET_ACCOUNT_1_PUBKEY_TR =
  '02e11c344f80d5fa9530183ed4c7f532c796def176c13276b7919f5047d82370b5';
const TEST_TESTNET_ACCOUNT_2_BTC_ADDRESS = 'tb1qr8me8t9gu9g6fu926ry5v44yp0wyljrespjtnz';

export function ecdsaPublicKeyToSchnorr(pubKey: Uint8Array) {
  if (pubKey.byteLength !== ecdsaPublicKeyLength) throw new Error('Invalid public key length');
  return pubKey.slice(1);
}

function getTaprootPayment(publicKey: Uint8Array) {
  return btc.p2tr(ecdsaPublicKeyToSchnorr(publicKey), undefined, bitcoinTestnet);
}

function buildTestNativeSegwitPsbtRequest(
  pubKey: Uint8Array
): PsbtRequestOptions & { broadcast: boolean } {
  const p2wpkh = btc.p2wpkh(pubKey, bitcoinTestnet);

  const tx = new btc.Transaction();

  tx.addInput({
    index: 0,
    txid: '5e03c0986d1b196dc586558bdcfcc9971c31e0c4c98ac7a6e86f9e07d899910c',
    witnessUtxo: {
      amount: BigInt(100),
      script: p2wpkh.script,
    },
  });
  tx.addInput({
    index: 0,
    txid: 'ef375b4af02821a14b249c879f818a50d3d0a98a334d70277ab329b9f5687108',
    witnessUtxo: {
      amount: BigInt(100),
      script: p2wpkh.script,
    },
  });
  tx.addOutput({
    amount: BigInt(200),
    script: p2wpkh.script,
  });

  const psbt = tx.toPSBT();

  // For testing mainnet
  // return { hex: tempHex };
  return { hex: bytesToHex(psbt), broadcast: true };
}

function buildTestNativeSegwitPsbtRequestWithIndexes(pubKey: Uint8Array): PsbtRequestOptions {
  const p2wpkh = btc.p2wpkh(pubKey, bitcoinTestnet);

  const tx = new btc.Transaction();

  tx.addInput({
    index: 0,
    txid: '5e03c0986d1b196dc586558bdcfcc9971c31e0c4c98ac7a6e86f9e07d899910c',
    witnessUtxo: {
      amount: BigInt(100),
      script: p2wpkh.script,
    },
  });
  tx.addInput({
    index: 0,
    txid: 'ef375b4af02821a14b249c879f818a50d3d0a98a334d70277ab329b9f5687108',
    witnessUtxo: {
      amount: BigInt(100),
      script: p2wpkh.script,
    },
  });
  tx.addOutput({
    amount: BigInt(200),
    script: p2wpkh.script,
  });

  const psbt = tx.toPSBT();

  return { signAtIndex: 0, hex: bytesToHex(psbt) };
}

function buildTestTaprootPsbtRequest(pubKey: Uint8Array): PsbtRequestOptions {
  const payment = getTaprootPayment(pubKey);

  const tx = new btc.Transaction();

  tx.addInput({
    index: 0,
    txid: '4f4cc7cb40b04978bd7704798dc1adf55b58196cef616b0fac8181965abc4726',
    witnessUtxo: {
      amount: BigInt(100),
      script: payment.script,
    },
  });
  tx.addOutput({
    amount: BigInt(100),
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
    // tapInternalKey: payment.tapInternalKey,
    witnessUtxo: {
      amount: BigInt(100),
      script: payment.script,
    },
  });
  tx.addOutput({
    amount: BigInt(100),
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
      <styled.h2>Bitcoin Testnet</styled.h2>
      <styled.span>Try testing Partially Signed Bitcoin Transactions.</styled.span>
      <styled.button
        mt={3}
        onClick={() => signTx(buildTestNativeSegwitPsbtRequest(segwitPubKey), stacksTestnetNetwork)}
      >
        Sign PSBT (Segwit)
      </styled.button>
      <styled.button
        ml={3}
        mt={3}
        onClick={() =>
          signTx(buildTestNativeSegwitPsbtRequestWithIndexes(segwitPubKey), stacksTestnetNetwork)
        }
      >
        Sign PSBT at indexes (SegWit)
      </styled.button>
      <styled.button
        ml={3}
        mt={3}
        onClick={() => signTx(buildTestTaprootPsbtRequest(taprootPubKey), stacksTestnetNetwork)}
      >
        Sign PSBT (Taproot)
      </styled.button>
      <styled.button
        ml={3}
        mt={3}
        onClick={() =>
          signTx(buildTestTaprootPsbtRequestWithIndex(taprootPubKey), stacksTestnetNetwork)
        }
      >
        Sign PSBT at index (Taproot)
      </styled.button>
      <styled.button
        mt={3}
        onClick={() => {
          console.log('requesting');
          window.btc
            ?.request('sendTransfer', {
              address: TEST_TESTNET_ACCOUNT_2_BTC_ADDRESS,
              amount: '10000',
              network: 'testnet',
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
      </styled.button>
    </Box>
  );
};
