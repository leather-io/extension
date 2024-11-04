import { expect } from '@playwright/test';
import {
  mockStacksBroadcastTransaction,
  mockStacksPendingTransaction,
  mockStacksRawTx,
  mockTestAccountStacksTxsRequestsWithPendingTx,
} from '@tests/mocks/mock-stacks-txs';
import { ActivitySelectors } from '@tests/selectors/activity.selectors';

import { test } from '../../fixtures/fixtures';

test.describe('Manage transaction', () => {
  test.beforeEach(async ({ homePage, extensionId, globalPage, onboardingPage }) => {
    await globalPage.setupAndUseApiCalls(extensionId);
    await mockTestAccountStacksTxsRequestsWithPendingTx(globalPage.page);
    await mockStacksRawTx(globalPage.page);
    await mockStacksPendingTransaction(globalPage.page);
    await mockStacksBroadcastTransaction(globalPage.page);
    await onboardingPage.signInWithTestAccount(extensionId);

    await homePage.clickActivityTab();
  });

  test('that user can cancel fee', async ({ page }) => {
    const activityList = page.getByTestId(ActivitySelectors.ActivityList);
    const manageTransactionBtn = activityList.getByTestId(ActivitySelectors.ActivityItemMenuBtn);
    await manageTransactionBtn.click();

    const cancelTxBtn = page.getByTestId(ActivitySelectors.ActivityItemMenuCancelTransaction);
    await cancelTxBtn.click();

    const cancelActionSheet = page.getByTestId(
      `${ActivitySelectors.TransactionActionSheet}-cancel`
    );

    const feeInput = cancelActionSheet.getByTestId(ActivitySelectors.TransactionActionFeeInput);
    await feeInput.fill('0.004');

    const submitBtn = page.getByTestId(ActivitySelectors.TransactionSubmitAction);
    await submitBtn.click();

    const toastMessage = 'Transaction cancelled successfully';
    const toast = page.getByText(toastMessage, { exact: true });
    await expect(toast).toBeVisible();
  });

  test('that user can increase fee', async ({ page }) => {
    const activityList = page.getByTestId(ActivitySelectors.ActivityList);
    const manageTransactionBtn = activityList.getByTestId(ActivitySelectors.ActivityItemMenuBtn);
    await manageTransactionBtn.click();

    const increaseFeeBtn = page.getByTestId(ActivitySelectors.ActivityItemMenuIncreaseFee);
    await increaseFeeBtn.click();

    const increaseFeeActionSheet = page.getByTestId(
      `${ActivitySelectors.TransactionActionSheet}-increase-fee`
    );

    const feeInput = increaseFeeActionSheet.getByTestId(
      ActivitySelectors.TransactionActionFeeInput
    );
    await feeInput.fill('0.004');

    const submitBtn = page.getByTestId(ActivitySelectors.TransactionSubmitAction);
    await submitBtn.click();

    const toastMessage = 'Fee increased successfully';
    const toast = page.getByText(toastMessage, { exact: true });
    await expect(toast).toBeVisible();
  });
});
