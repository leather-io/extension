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

// For testing mainnet
const tempHex =
  '70736274ff0100fd36010200000004350db8bb43dc351cf4f611aab22363c1fcfb27c61f2f7e55f3e38a1384248c660100000000ffffffff8fcf2bcf05c76ef86595c3bbe2f944064b34eede0c4c3c5dce4f1f94e663183d0000000000ffffffff8391b15b124ad2276c13916a61efabbfcc34f4211b3e6123829eaeab8096b8420000000000ffffffffe4653717d3c1544b073f97978998558be6c8e8aa7e51922303ec4814551fa16e0000000000ffffffff041027000000000000225120e25ef2545bce7dd7bd4215cdc76d16fe72c63163dca3f7a0757efa928841c96b7c920000000000001600146a9d9d7679bfeaf45c3a7d5b88826ec657ea91e2c4090000000000001600146a9d9d7679bfeaf45c3a7d5b88826ec657ea91e2983a0000000000001600149c1a4f6160d35ffada2e230f8bf1c4cfaf6ff52f00000000000100fdaa0301000000000102371586ae4679b5e411fced4b36ec421f65527447be8e3d0206419f979214fdf20000000000fdffffff5466bdc917b6a13f1db9429ee649a08b6b3860366e87202e0934d193e07a0d5b0100000000fdffffff02102700000000000022512044cab551f8178996c12870fcfd0399e3b0e4b9bb0312fc1c8b07b02e2dc17b0af92a0000000000002251207f4d47576eeaaa79a4cf320bf0b1876e50d943bdbbfc2823d99df37e642a37880140c6dff1e2084c2ae245c8b4b7751b9a5b1145f347d9d0ae06b8e2ec4591a2ab53fea2e5c6a356dfc6a54f51a7f15f1d1db8f056e8713842bfed58a1e063841c090341b00ba699988211aaa2e2464290bbc7db231765c5eaff65e0a7c2be27315093caa4009f2b302912f125d6bc28680bc1cfca7796647259e003a601f12683c1808081fd4c02204878d26dbb1678c06558222e1fd68e9ed68783fbb68d9f2bcb7ace09b225149dac0063036f726401032468eb6429a613f2564a36ce39589cda9ae404605267c4e0908c27ad1f144a0de900000000010117746578742f68746d6c3b636861727365743d7574662d38004dde013c626f64792f3e3c7363726970743e6a3d323b643d646f63756d656e743b623d642e626f64790a636c6173732055524c536561726368506172616d737b6765743d6b3d3e6b3d3d22746f6b656e4944223f6a3a307d286173796e6328293d3e7b713d225c6e220a6a3d393532302b282b617761697428617761697420666574636828222f636f6e74656e742f6463656538306631316133313034616233326633313665623763656466323839653436616531313533353362383165376432343362643431616462343734376669302229292e7465787428292b6a29253330300a69662869734e614e286a292972657475726e3b0a683d28617761697428617761697420666574636828222f636f6e74656e742f6539306434613134316661643237386339306530633436373532363030346534396164613963353833396365333634613536663231336136323936346562363869302229292e746578742829292e73706c69742871290a622e696e6e657248544d4c3d685b305d3b0a7a3d646f63756d656e742e637265617465456c656d656e74282273637269707422290a7a2e696e6e657248544d4c3d682e736c69636528322c34292e6a6f696e2871290a622e617070656e644368696c64287a297d2928293c2f7363726970743e0a6821c04878d26dbb1678c06558222e1fd68e9ed68783fbb68d9f2bcb7ace09b225149d0000000001012bf92a0000000000002251207f4d47576eeaaa79a4cf320bf0b1876e50d943bdbbfc2823d99df37e642a3788011720937077dcbafef4c74be898fbf723c628787f0d9922c384e6e80eded948d033ee000100df01000000000101e4653717d3c1544b073f97978998558be6c8e8aa7e51922303ec4814551fa16e0100000000fdffffff0260ea0000000000001600149c1a4f6160d35ffada2e230f8bf1c4cfaf6ff52fc81adf01000000001600143c2a59281416c1a9e9dc55170be53c5577d420e202483045022100bac8690acbd849d57687f889854f8abaf688f0b5e02eafa555ff3d86e62a8aad022071439d2bbae03118a0dc8fdb3e85405a459e0e7279f6f4659491fbfe11f1ce6601210234943fdac5b5d4d6c28e03b89a6adb6c7a3f55e782e718af3a251764a320da7500000000000100de0100000000010113edda3c24c6c3e0bdd37418ff173c558075010d763bb037773968e8f5f8da3f0000000000fdffffff0230750000000000001600149c1a4f6160d35ffada2e230f8bf1c4cfaf6ff52f712df800000000001600142547a6fb036a168e7cfb3359e7553c63e4252170024730440220060f1f5614a368bc319531050b043af5aa2d87222dc8cf134dc2b209588c6dfc0220069f1c978ed6cc68f5eef40e319697215a7f0f4ce5c5411a40d6bd08c69b3430012102567b081243c6b8439932d52e2f8a8bd2133ce18c4e63b6ee4a40e09dc73d897300000000000100de010000000001016c21dd4dc9508a4383dd364f5249d7f9c126093845dc9186e18bae449ff13e7a0000000000fdffffff02a8610000000000001600149c1a4f6160d35ffada2e230f8bf1c4cfaf6ff52fdf32e001000000001600142547a6fb036a168e7cfb3359e7553c63e4252170024730440220703a99388b1d04c7c1d22e79994e04100f19abb165105710bbe12a338930e45902204d8ed7eae8be52d06912911a0d3ad1dd2bf9d2f9ef0acf2e56293c3213d726e5012102d5369b8460ed3e38d6313bc308a207c7eed33ac6d18ced08ece56f885ce54657000000000000000000';

const ecdsaPublicKeyLength = 33;
const TEST_TESTNET_ACCOUNT_1_PUBKEY_P2WPKH =
  '02b6b0afe5f620bc8e532b640b148dd9dea0ed19d11f8ab420fcce488fe3974893';
const TEST_TESTNET_ACCOUNT_1_PUBKEY_TR =
  '03cf7525b9d94fd35eaf6b4ac4c570f718d1df142606ba3a64e2407ea01a37778f';
const TEST_TESTNET_ACCOUNT_2_BTC_ADDRESS = 'tb1qkzvk9hr7uvas23hspvsgqfvyc8h4nngeqjqtnj';

export function ecdsaPublicKeyToSchnorr(pubKey: Uint8Array) {
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

  // For testing mainnet
  return { hex: tempHex };
  // return { hex: bytesToHex(psbt) };
}

function buildTestNativeSegwitPsbtRequestWithIndexes(pubKey: Uint8Array): PsbtRequestOptions {
  const p2wpkh = btc.p2wpkh(pubKey, bitcoinTestnet);

  const tx = new btc.Transaction();

  tx.addInput({
    index: 0,
    txid: '5be910a6557bae29b8ff2dbf4607dbf783eaf82802896d13f61d975c133ccce7',
    sighashType: 1,
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

  return { signAtIndex: [0, 1], hex: bytesToHex(psbt), allowedSighash: [2] };
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
    // tapInternalKey: payment.tapInternalKey,
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
      </Button>
    </Box>
  );
};
