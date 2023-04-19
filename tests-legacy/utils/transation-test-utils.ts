import { ContractCallOptions, UserData, makeContractCallToken } from '@stacks/connect';
import { StacksTestnet } from '@stacks/network';
import {
  FungibleConditionCode,
  PostConditionMode,
  createAssetInfo,
  makeStandardFungiblePostCondition,
  serializePostCondition,
} from '@stacks/transactions';
import BN from 'bn.js';
import { vi } from 'vitest';

(window as any).fetch = vi.fn(() => ({
  text: () => Promise.resolve(1),
  ok: true,
}));

const defaultUserSession: Partial<UserData> = {
  appPrivateKey: 'e494f188c2d35887531ba474c433b1e41fadd8eb824aca983447fd4bb8b277a801',
};

export async function generateContractCallToken({
  userData,
  txOptions,
}: {
  userData?: Partial<UserData>;
  txOptions?: Partial<ContractCallOptions>;
} = {}) {
  const address = 'ST1EXHZSN8MJSJ9DSG994G1V8CNKYXGMK7Z4SA6DH';
  const assetAddress = 'ST34RKEJKQES7MXQFBT29KSJZD73QK3YNT5N56C6X';
  const assetContractName = 'test-asset-contract';
  const assetName = 'test-asset-name';
  const info = createAssetInfo(assetAddress, assetContractName, assetName);
  serializePostCondition(
    makeStandardFungiblePostCondition(
      address,
      FungibleConditionCode.GreaterEqual,
      new BN(100).toString(),
      info
    )
  );
  localStorage.setItem(
    'blockstack-session',
    JSON.stringify({
      userData: userData || defaultUserSession,
      version: '1.0.0',
    })
  );
  const network = new StacksTestnet();
  const txDataToken = await makeContractCallToken({
    contractAddress: 'ST1EXHZSN8MJSJ9DSG994G1V8CNKYXGMK7Z4SA6DH',
    contractName: 'hello-world',
    functionArgs: [],
    functionName: 'print',
    postConditionMode: PostConditionMode.Allow,
    network: network as any,
    postConditions: [
      makeStandardFungiblePostCondition(
        address,
        FungibleConditionCode.GreaterEqual,
        new BN(100).toString(),
        info
      ),
    ],
    ...txOptions,
  });
  return txDataToken;
}
