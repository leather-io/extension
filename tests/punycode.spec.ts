import { AddressNonces } from '@stacks/blockchain-api-client/lib/generated/models/AddressNonces';
import { AddressBalanceResponse } from '@stacks/stacks-blockchain-api-types';
import {
  addressToString,
  deserializeTransaction,
  isTokenTransferPayload,
} from '@stacks/transactions';
import { OnboardingSelectors } from '@tests-legacy/integration/onboarding/onboarding.selectors';
import { HomePageSelectors } from '@tests-legacy/page-objects/home.selectors';
import { SendFormSelectors } from '@tests-legacy/page-objects/send-form.selectors';

import { RouteUrls } from '@shared/route-urls';

import { json } from './utils/json';
import { test } from './utils/testfn';

test('recipient address matches resolved bns name', async ({ page, extensionId }) => {
  await page.route(/.*/, route => route.abort());
  await page.route(/chrome-extension/, route => route.continue());
  await page.route(/github/, route => route.fulfill(json({})));
  await page.route(/stacks.co.+balances$/, route => {
    const res: AddressBalanceResponse = {
      stx: {
        balance: '1000000000',
        total_sent: '0',
        total_received: '0',
        total_fees_sent: '0',
        total_miner_rewards_received: '0',
        lock_tx_id: '',
        locked: '0',
        lock_height: 0,
        burnchain_lock_height: 0,
        burnchain_unlock_height: 0,
      },
      fungible_tokens: {},
      non_fungible_tokens: {},
    };
    return route.fulfill(json(res));
  });
  await page.route(/nonce/, route => {
    const res: AddressNonces = {
      last_executed_tx_nonce: 1,
      last_mempool_tx_nonce: null,
      possible_next_nonce: 2,
      detected_missing_nonces: [],
    };
    return route.fulfill(json(res));
  });
  const bnsName = 'example.bns';
  const address = 'SP11W6YAR16YN6P5N7425DMQV1HY5QZT959CKPVPW';
  await page.route(new RegExp(`stacks.co.+${bnsName}`), route => route.fulfill(json({ address })));

  await page.goto(`chrome-extension://${extensionId}/index.html`);

  await page.getByTestId(OnboardingSelectors.AnalyticsDenyBtn).click();
  await page.waitForURL('**' + RouteUrls.Onboarding);

  await page.getByTestId(OnboardingSelectors.SignUpBtn).click();
  await page.waitForURL('**' + RouteUrls.BackUpSecretKey);

  await page.getByTestId(OnboardingSelectors.BackUpSecretKeyBtn).click();
  await page.waitForURL('**' + RouteUrls.SetPassword);

  await page.getByTestId(OnboardingSelectors.NewPasswordInput).fill('my_s3cret_p@ssw0r4');
  await page.getByTestId(OnboardingSelectors.SetPasswordBtn).click();
  await page.waitForURL('**' + RouteUrls.Home);

  await page.getByTestId(HomePageSelectors.BtnSendTokens).click();
  await page.waitForURL('**' + RouteUrls.Send);

  await page.getByTestId(SendFormSelectors.InputAmountField).fill('1');
  await page.getByTestId(SendFormSelectors.InputRecipientField).fill(bnsName);
  await page.getByTestId(SendFormSelectors.InputMemoField).click();
  await page.getByTestId(SendFormSelectors.ResolvedBnsAddressPreview).waitFor();
  await page.getByTestId(SendFormSelectors.ResolvedBnsAddressHoverInfoIcon).hover();
  await page.getByText(address).waitFor();
  await page.getByTestId(SendFormSelectors.ResolvedBnsAddressCopyToClipboard).waitFor();

  await page.getByTestId(SendFormSelectors.BtnPreviewSendTx).click();
  const [request] = await Promise.all([
    page.waitForRequest(/.*v2\/transactions/),
    page.getByTestId(SendFormSelectors.SendToken).click(),
  ]);
  const serializedTx = request.postDataBuffer();
  if (serializedTx === null) throw new Error('Expected `serializedTx` to not be `null`.');
  const tx = deserializeTransaction(serializedTx);

  const payload = tx.payload;
  if (!isTokenTransferPayload(payload))
    throw new Error('Expected `payload` to be of type `TransferTokenPayload`.');

  test.expect(addressToString(payload.recipient.address)).toEqual(address);
});
