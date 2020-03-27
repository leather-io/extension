import { app } from '../src/app';
import request from 'supertest';
import { BufferReader } from '@blockstack/stacks-transactions/lib/src/utils';
import {
  StacksTransaction,
  Address,
  StacksPrivateKey,
  StacksPublicKey,
  AddressHashMode,
} from '@blockstack/stacks-transactions';

process.env.FAUCET_PRIVATE_KEY = 'a3a0263c585ba8f7eb37fefaee001383b09cc6897965096aa0f52d12ea88e8b901';
const RECIPIENT_PUBLIC = '02ce1aa125661699d8a6f0f74eba9c468920864c5ef96be608b73316fa5d6c2ab8';
const RECIPIENT_ADDR = 'ST392065ZG2CHWJZTPHZF4X10WPNBMSH7RCSHSCRS';

describe('faucet', () => {
  const getFaucetTX = async () => {
    const response = await request(app).post(`/api/faucet?address=${RECIPIENT_ADDR}`);
    const { success, tx } = response.body;
    expect(success).toEqual(true);
    expect(tx).not.toBeFalsy();
    const buffer = Buffer.from(tx, 'hex');
    const bufferReader = new BufferReader(buffer);
    const stacksTX = new StacksTransaction();
    stacksTX.deserialize(bufferReader);
    return stacksTX;
  };

  test('sends from the correct address', async () => {
    const stacksTX = await getFaucetTX();
    const sender = stacksTX.auth.spendingCondition.signerAddress;
    const privKey = new StacksPrivateKey(process.env.FAUCET_PRIVATE_KEY);
    const pubKey = privKey.getPublicKey();
    const addr = Address.fromPublicKeys(0, AddressHashMode.SerializeP2PKH, 1, [new StacksPublicKey(pubKey.toString())]);
    expect(sender.data).toEqual(addr.data);
  });

  test('sends to the correct address', async () => {
    const stacksTX = await getFaucetTX();
    const recipient = Address.fromPublicKeys(0, AddressHashMode.SerializeP2PKH, 1, [
      new StacksPublicKey(RECIPIENT_PUBLIC),
    ]);
    expect(stacksTX.payload.recipientAddress.data).toEqual(recipient.data);
  });
});
