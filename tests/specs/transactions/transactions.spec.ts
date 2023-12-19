import { TokenTransferPayload, deserializeTransaction } from '@stacks/transactions';
import { TestAppPage } from '@tests/page-object-models/test-app.page';
import { TransactionRequestPage } from '@tests/page-object-models/transaction-request.page';

import { stxToMicroStx } from '@app/common/money/unit-conversion';

import { test } from '../../fixtures/fixtures';

test.describe('Transaction signing', () => {
  let testAppPage: TestAppPage;

  test.beforeEach(async ({ extensionId, globalPage, onboardingPage, context }) => {
    await globalPage.setupAndUseApiCalls(extensionId);
    await onboardingPage.signInWithTestAccount(extensionId);

    testAppPage = await TestAppPage.openDemoPage(context);
    await testAppPage.signIn();
  });

  // These tests often break if ran in parallel
  test.describe.configure({ mode: 'serial' });

  test.describe('Contract calls', () => {
    test('that it validates against insufficient funds when performing a contract call', async ({
      context,
    }) => {
      const accountsPage = await context.waitForEvent('page');
      await accountsPage.locator('text="Account 2"').click();
      await testAppPage.page.bringToFront();
      await testAppPage.page.click('text=Debugger', {
        timeout: 30000,
      });
      await accountsPage.close();

      await testAppPage.clickContractCallButton();
      const transactionRequestPage = new TransactionRequestPage(await context.waitForEvent('page'));
      const error =
        await transactionRequestPage.waitForTransactionRequestError('Insufficient balance');

      test.expect(error).toBeTruthy();
    });
  });

  test.describe('App initiated STX transfer', () => {
    test('that it broadcasts correctly with given fee and amount', async ({ context }) => {
      const accountsPage = await context.waitForEvent('page');
      await accountsPage.locator('text="Account 1"').click();
      await testAppPage.page.bringToFront();
      await testAppPage.page.click('text=Debugger', {
        timeout: 30000,
      });
      await accountsPage.close();

      await testAppPage.clickStxTransferButton();
      const transactionRequestPage = new TransactionRequestPage(await context.waitForEvent('page'));

      await transactionRequestPage.waitForTransactionRequestPage();
      await transactionRequestPage.waitForFee();

      const displayedFee = await transactionRequestPage.getDisplayedFeeValue();

      if (!displayedFee) throw new Error('Cannot pull fee from UI');

      const requestPromise = transactionRequestPage.page.waitForRequest('*/**/v2/transactions');

      await transactionRequestPage.page.route('*/**/v2/transactions', async route => {
        await route.abort();
      });

      await transactionRequestPage.clickConfirmTransactionButton();

      const request = await requestPromise;
      const requestBody = request.postDataBuffer();
      if (!requestBody) return;

      const deserialisedTx = deserializeTransaction(requestBody);
      const payload = deserialisedTx.payload as TokenTransferPayload;
      const amount = Number(payload.amount);
      const fee = Number(deserialisedTx.auth.spendingCondition?.fee);
      const parsedDisplayedFee = parseFloat(displayedFee.replace(' STX', ''));

      test.expect(fee).toEqual(stxToMicroStx(parsedDisplayedFee).toNumber());
      test.expect(amount).toEqual(102);
    });
  });
});
