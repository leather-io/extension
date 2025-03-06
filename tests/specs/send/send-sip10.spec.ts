import { expect } from '@playwright/test';
import { TEST_ACCOUNT_2_STX_ADDRESS } from '@tests/mocks/constants';
import { mockStacksBroadcastTransaction } from '@tests/mocks/mock-stacks-txs';
import { SendCryptoAssetSelectors } from '@tests/selectors/send.selectors';

import { test } from '../../fixtures/fixtures';

const amount = '0.000001';

test.describe('Send sip10', () => {
  test.beforeEach(async ({ extensionId, globalPage, homePage, onboardingPage, sendPage }) => {
    await globalPage.setupAndUseApiCalls(extensionId);
    await mockStacksBroadcastTransaction(globalPage.page);

    await onboardingPage.signInWithTestAccount(extensionId);
    await homePage.sendButton.click();
    await sendPage.selectSIP10AndGoToSendForm();
  });

  test('can send sip10 token', async ({ sendPage }) => {
    await sendPage.amountInput.fill(amount);
    await sendPage.recipientInput.fill(TEST_ACCOUNT_2_STX_ADDRESS);
    await sendPage.recipientInput.blur();

    await sendPage.previewSendTxButton.click();
    const details = await sendPage.confirmationDetails.allInnerTexts();

    test.expect(details).toBeTruthy();

    await sendPage.confirmSendTransaction();

    const sentTransactionSummaryPage = sendPage.page.getByTestId(
      SendCryptoAssetSelectors.SentTransactionSummary
    );

    await expect(sentTransactionSummaryPage).toBeAttached();
  });
});
