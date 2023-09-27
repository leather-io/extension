import { Page } from '@playwright/test';
import { TokenTransferPayload, deserializeTransaction } from '@stacks/transactions';
import { TestAppPage } from '@tests/page-object-models/test-app.page';
import { TransactionRequestPage } from '@tests/page-object-models/transaction-request.page';

import { stxToMicroStx } from '@app/common/money/unit-conversion';

import { test } from '../../fixtures/fixtures';

test.describe('Transaction signing', () => {
  let testAppPage: TestAppPage;

  function interceptTransactionBroadcast(page: Page): Promise<Buffer> {
    return new Promise(resolve => {
      page.on('request', request => {
        if (request.url().endsWith('/v2/transactions')) {
          const requestBody = request.postDataBuffer();
          if (requestBody === null) return;
          resolve(requestBody);
        }
      });
    });
  }

  test.beforeEach(async ({ extensionId, globalPage, onboardingPage, context }) => {
    await globalPage.setupAndUseApiCalls(extensionId);
    await onboardingPage.signInWithTestAccount(extensionId);

    testAppPage = await TestAppPage.openDemoPage(context);
    await testAppPage.signIn();
    const accountsPage = await context.waitForEvent('page');
    await accountsPage.locator('text="Account 1"').click();
    await testAppPage.page.bringToFront();
    await testAppPage.page.click('text=Debugger', {
      timeout: 30000,
    });
    await accountsPage.close();
  });

  test.describe('Contract calls', () => {
    test('that it validates against insufficient funds when performing a contract call', async ({
      context,
    }) => {
      await testAppPage.clickContractCallButton();
      const transactionRequestPage = new TransactionRequestPage(await context.waitForEvent('page'));
      const error = await transactionRequestPage.waitForTransactionRequestError(
        'Insufficient balance'
      );

      test.expect(error).toBeTruthy();
    });
  });

  test.describe('App initiated STX transfer', () => {
    test.skip('this it broadcasts correctly with given fee and amount', async ({ context }) => {
      await testAppPage.clickStxTransferButton();
      const transactionRequestPage = new TransactionRequestPage(await context.waitForEvent('page'));

      await transactionRequestPage.waitForTransactionRequestPage();
      await transactionRequestPage.waitForFee();

      const displayedFee = await transactionRequestPage.getDisplayedFeeValue();

      if (!displayedFee) throw new Error('Cannot pull fee from UI');

      const [_, requestBody] = await Promise.all([
        transactionRequestPage.clickConfirmTransactionButton(),
        interceptTransactionBroadcast(transactionRequestPage.page),
      ]);

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
