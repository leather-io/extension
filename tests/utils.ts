import { Locator } from '@playwright/test';

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
