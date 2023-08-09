import { TEST_BNS_NAME, TEST_BNS_RESOLVED_ADDRESS } from '@tests/mocks/constants';

import { test } from '../../fixtures/fixtures';

test.describe('send stx using bns', () => {
  test.beforeEach(async ({ extensionId, globalPage, homePage, onboardingPage, sendPage }) => {
    await globalPage.setupAndUseApiCalls(extensionId);
    await onboardingPage.signInWithTestAccount(extensionId);
    await homePage.sendButton.click();
    await sendPage.selectStxAndGoToSendForm();
  });

  test('that recipient address matches bns name', async ({ page, sendPage }) => {
    await sendPage.amountInput.fill('.0001');
    await sendPage.amountInput.blur();
    await sendPage.recipientSelectFieldAddress.click();
    await sendPage.recipientSelectFieldBnsName.click();
    await sendPage.recipientInput.fill(TEST_BNS_NAME);
    await sendPage.recipientInput.blur();
    await sendPage.recipientBnsAddressLabel.waitFor();
    const bnsResolvedAddress = await page.getByText(TEST_BNS_RESOLVED_ADDRESS).innerText();

    test.expect(bnsResolvedAddress).toBeTruthy();
  });
});
