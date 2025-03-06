import React, { useContext } from 'react';

import { AppContext } from '@common/context';
import { stacksTestnetNetwork } from '@common/utils';
import * as btc from '@scure/btc-signer';
import { bytesToHex, hexToBytes } from '@stacks/common';
import { PsbtData, PsbtRequestOptions } from '@stacks/connect-jwt';
import { useConnect } from '@stacks/connect-react-jwt';
import { StacksNetwork } from '@stacks/network';
import { styled } from 'leather-styles/jsx';

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
    nonWitnessUtxo: {
      version: 1,
      segwitFlag: false,
      inputs: [
        {
          txid: hexToBytes('0c634e54f790a1e92b38b54f9b15995b0bb349e701f782c0f2b51cabfb619db3'),
          index: 0,
          finalScriptSig: hexToBytes(''),
          sequence: 4294967293,
        },
      ],
      outputs: [
        {
          amount: BigInt(1112640),
          script: hexToBytes('0014a8113965cee4d5ffa2d9996a204866a58200131d'),
        },
        {
          amount: BigInt(36595102),
          script: hexToBytes('001436d197d642a9b02fa0d31b34fe0eab93f273a3c8'),
        },
      ],
      lockTime: 2536001,
    },
  });
  tx.addInput({
    index: 0,
    txid: '13c87eb1eb080ac9bf4f8b649b70e0bc83335c3b9a684b3a9d7216e8b4d3b247',
    nonWitnessUtxo: {
      version: 1,
      segwitFlag: false,
      inputs: [
        {
          txid: hexToBytes('8be3e863d8db3e41919f16b07f158fbbe87924055eb4a256293fb5bacd6c4926'),
          index: 1,
          finalScriptSig: hexToBytes(''),
          sequence: 0,
        },
      ],
      outputs: [
        {
          amount: BigInt(10000),
          script: hexToBytes('0014a8113965cee4d5ffa2d9996a204866a58200131d'),
        },
        {
          amount: BigInt(5363),
          script: hexToBytes('00148027825ee06ad337f9716df8137a1b651163c5b0'),
        },
      ],
      lockTime: 2536001,
    },
  });
  tx.addInput({
    index: 0,
    txid: 'ed1f2163137e5714b1a8da2a2409067e0d5526347b93d5300b1930a015b8f78b',
    nonWitnessUtxo: {
      version: 1,
      segwitFlag: false,
      inputs: [
        {
          txid: hexToBytes('ed1f2163137e5714b1a8da2a2409067e0d5526347b93d5300b1930a015b8f78b'),
          index: 1,
          finalScriptSig: hexToBytes(''),
          sequence: 0,
        },
      ],
      outputs: [
        {
          amount: BigInt(6000),
          script: hexToBytes('001419f793aca8e151a4f0aad0c94656a40bdc4fc879'),
        },
        {
          amount: BigInt(1468212),
          script: hexToBytes('0014a8113965cee4d5ffa2d9996a204866a58200131d'),
        },
      ],
      lockTime: 0,
    },
  });
  tx.addOutput({
    amount: BigInt(100),
    script: p2wpkh.script,
  });

  const psbt = tx.toPSBT();
  console.log(bytesToHex(psbt));
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
    nonWitnessUtxo: {
      version: 1,
      segwitFlag: false,
      inputs: [
        {
          txid: hexToBytes('0c634e54f790a1e92b38b54f9b15995b0bb349e701f782c0f2b51cabfb619db3'),
          index: 0,
          finalScriptSig: hexToBytes(''),
          sequence: 4294967293,
        },
      ],
      outputs: [
        {
          amount: BigInt(1112640),
          script: hexToBytes('0014a8113965cee4d5ffa2d9996a204866a58200131d'),
        },
        {
          amount: BigInt(36595102),
          script: hexToBytes('001436d197d642a9b02fa0d31b34fe0eab93f273a3c8'),
        },
      ],
      lockTime: 2536001,
    },
  });
  tx.addInput({
    index: 0,
    txid: '13c87eb1eb080ac9bf4f8b649b70e0bc83335c3b9a684b3a9d7216e8b4d3b247',
    nonWitnessUtxo: {
      version: 1,
      segwitFlag: false,
      inputs: [
        {
          txid: hexToBytes('8be3e863d8db3e41919f16b07f158fbbe87924055eb4a256293fb5bacd6c4926'),
          index: 1,
          finalScriptSig: hexToBytes(''),
          sequence: 0,
        },
      ],
      outputs: [
        {
          amount: BigInt(10000),
          script: hexToBytes('0014a8113965cee4d5ffa2d9996a204866a58200131d'),
        },
        {
          amount: BigInt(5363),
          script: hexToBytes('00148027825ee06ad337f9716df8137a1b651163c5b0'),
        },
      ],
      lockTime: 2536001,
    },
  });
  tx.addInput({
    index: 0,
    txid: 'ed1f2163137e5714b1a8da2a2409067e0d5526347b93d5300b1930a015b8f78b',
    nonWitnessUtxo: {
      version: 1,
      segwitFlag: false,
      inputs: [
        {
          txid: hexToBytes('ed1f2163137e5714b1a8da2a2409067e0d5526347b93d5300b1930a015b8f78b'),
          index: 1,
          finalScriptSig: hexToBytes(''),
          sequence: 0,
        },
      ],
      outputs: [
        {
          amount: BigInt(6000),
          script: hexToBytes('001419f793aca8e151a4f0aad0c94656a40bdc4fc879'),
        },
        {
          amount: BigInt(1468212),
          script: hexToBytes('0014a8113965cee4d5ffa2d9996a204866a58200131d'),
        },
      ],
      lockTime: 0,
    },
  });
  tx.addOutput({
    amount: BigInt(100),
    script: p2wpkh.script,
  });

  const psbt = tx.toPSBT();

  return { hex: bytesToHex(psbt), signAtIndex: 0 };
}

function buildTestTaprootPsbtRequest(pubKey: Uint8Array): PsbtRequestOptions {
  const payment = getTaprootPayment(pubKey);

  const tx = new btc.Transaction();

  tx.addInput({
    index: 0,
    txid: '4f4cc7cb40b04978bd7704798dc1adf55b58196cef616b0fac8181965abc4726',
    nonWitnessUtxo: {
      version: 1,
      segwitFlag: false,
      inputs: [
        {
          txid: hexToBytes('ed1f2163137e5714b1a8da2a2409067e0d5526347b93d5300b1930a015b8f78b'),
          index: 0,
          finalScriptSig: hexToBytes(''),
          sequence: 4294967294,
        },
      ],
      outputs: [
        {
          amount: BigInt(1000),
          script: hexToBytes(
            '5120d7b0a2cb4ea70c8d707caca0b06fb1c640c614d91f5e96baf5c3dd097cdfb113'
          ),
        },
        {
          amount: BigInt(1661000),
          script: hexToBytes('001469f127131937ecffe8379a77dc0ecb255a3ade11'),
        },
      ],
      lockTime: 2428539,
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
    nonWitnessUtxo: {
      version: 1,
      segwitFlag: false,
      inputs: [
        {
          txid: hexToBytes('ed1f2163137e5714b1a8da2a2409067e0d5526347b93d5300b1930a015b8f78b'),
          index: 0,
          finalScriptSig: hexToBytes(''),
          sequence: 4294967294,
        },
      ],
      outputs: [
        {
          amount: BigInt(1000),
          script: hexToBytes(
            '5120d7b0a2cb4ea70c8d707caca0b06fb1c640c614d91f5e96baf5c3dd097cdfb113'
          ),
        },
        {
          amount: BigInt(1661000),
          script: hexToBytes('001469f127131937ecffe8379a77dc0ecb255a3ade11'),
        },
      ],
      lockTime: 2428539,
    },
  });
  tx.addOutput({
    amount: BigInt(100),
    script: payment.script,
  });

  const psbt = tx.toPSBT();

  return { hex: bytesToHex(psbt), signAtIndex: 2 };
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
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
      }}
    >
      <styled.h2>Bitcoin Testnet</styled.h2>
      <styled.span>Try testing Partially Signed Bitcoin Transactions.</styled.span>

      <div
        style={{
          padding: '24px 0',
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '16px',
          width: '100%',
        }}
      >
        <styled.button
          mt={3}
          onClick={() =>
            signTx(buildTestNativeSegwitPsbtRequest(segwitPubKey), stacksTestnetNetwork)
          }
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
          Sign PSBT at index failure (Taproot)
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
        <styled.button
          mt={3}
          onClick={() => {
            console.log('requesting');
            (window as any).LeatherProvider?.request('sendTransfer', {
              recipients: [
                {
                  address: TEST_TESTNET_ACCOUNT_2_BTC_ADDRESS,
                  amount: '800',
                },
                {
                  address: TEST_TESTNET_ACCOUNT_2_BTC_ADDRESS,
                  amount: '900',
                },
              ],
              network: 'testnet',
            })
              .then((resp: any) => {
                console.log({ sucesss: resp });
              })
              .catch((error: Error) => {
                console.log({ error });
              });
          }}
        >
          Send transfer to multiple addresses
        </styled.button>
        <styled.button
          mt={3}
          onClick={() => {
            console.log('requesting');
            (window as any).LeatherProvider?.request('sendTransfer', {
              recipients: [
                {
                  address: 'bc1qps90ws94pvk548y9jg03gn5lwjqnyud4lg6y56',
                  amount: '800',
                },
                {
                  address: 'bc1qyrtw5v0rkmytg0gu34f06fxpyfk24x7jevtvx3',
                  amount: '10000',
                },
              ],
              network: 'mainnet',
            })
              .then((resp: any) => {
                console.log({ sucesss: resp });
              })
              .catch((error: Error) => {
                console.log({ error });
              });
          }}
        >
          Send native segwit transfer to multiple addresses
        </styled.button>
        <styled.button
          mt={3}
          onClick={() => {
            console.log('requesting');
            (window as any).LeatherProvider?.request('sendTransfer', {
              recipients: [
                {
                  address: 'bc1p8nyc4sl8agqfjs2rq4yer6wnhd89naw05s0ha8hpmg8j36ht6yvswqyaxm',
                  amount: '800',
                },
                {
                  address: 'bc1p8nyc4sl8agqfjs2rq4yer6wnhd89naw05s0ha8hpmg8j36ht6yvswqyaxm',
                  amount: '10000',
                },
              ],
              network: 'mainnet',
            })
              .then((resp: any) => {
                console.log({ sucesss: resp });
              })
              .catch((error: Error) => {
                console.log({ error });
              });
          }}
        >
          Send taproot transfer to multiple addresses
        </styled.button>
        <styled.button
          mt={3}
          onClick={() => {
            console.log('requesting');
            (window as any).LeatherProvider?.request('sendTransfer', {
              recipients: [
                {
                  address: TEST_TESTNET_ACCOUNT_2_BTC_ADDRESS,
                  amount: '10000',
                },
                {
                  address: TEST_TESTNET_ACCOUNT_2_BTC_ADDRESS,
                  amount: '10000',
                },
              ],
            })
              .then((resp: any) => {
                console.log({ sucesss: resp });
              })
              .catch((error: Error) => {
                console.log({ error });
              });
          }}
        >
          Send transfer validate error
        </styled.button>
      </div>
    </div>
  );
};
