import { Locator } from '@playwright/test';
import { makeUnsignedSTXTokenTransfer } from '@stacks/transactions';

import { SharedComponentsSelectors } from './selectors/shared-component.selectors';

export function json(arg: unknown) {
  return {
    body: JSON.stringify(arg),
    contentType: 'application/json',
  };
}

export function createTestSelector<T extends string>(name: T): `[data-testid="${T}"]` {
  return `[data-testid="${name}"]`;
}

export async function getDisplayerAddress(locator: Locator) {
  const displayerAddress = await locator
    .getByTestId(SharedComponentsSelectors.AddressDisplayer)
    .innerText();

  return displayerAddress.replaceAll('\n', '');
}

export async function generateUnsignedStxTransfer(
  recipient: string,
  amount: number,
  network: any,
  publicKey: string,
  memo?: string
) {
  const options = {
    recipient,
    memo,
    publicKey,
    amount,
    network,
  };
  return (await makeUnsignedSTXTokenTransfer(options)).serialize();
}

export async function generateMultisigUnsignedStxTransfer(
  recipient: string,
  amount: number,
  fee: number,
  network: any,
  publicKeys: string[],
  threshold: number,
  nonce: number,
  memo?: string
) {
  const options = {
    fee,
    recipient,
    memo,
    publicKeys,
    nonce,
    numSignatures: threshold,
    amount,
    network,
  };
  return (await makeUnsignedSTXTokenTransfer(options)).serialize();
}
