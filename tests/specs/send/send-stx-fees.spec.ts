import { SharedComponentsSelectors } from '@tests/selectors/shared-component.selectors';

import { test } from '../../fixtures/fixtures';

test.describe('send stx fees', () => {
  test.beforeEach(async ({ extensionId, globalPage, homePage, onboardingPage, sendPage }) => {
    await globalPage.setupAndUseApiCalls(extensionId);
    await onboardingPage.signInWithTestAccount(extensionId);
    await homePage.sendButton.click();
    await sendPage.selectStxAndGoToSendForm();
    await sendPage.waitForStxSendPageReady();
  });

  test('that fee row defaults to middle fee estimation', async ({ page }) => {
    await page.getByTestId(SharedComponentsSelectors.FeeToBePaidLabel).scrollIntoViewIfNeeded();
    const feeToBePaid = await page
      .getByTestId(SharedComponentsSelectors.FeeToBePaidLabel)
      .innerText();
    const fee = Number(feeToBePaid.split(' ')[0]);
    // Using min/max fee caps
    const isMiddleFee = fee >= 0.003 && fee <= 0.75;
    test.expect(isMiddleFee).toBeTruthy();
  });

  test('that low fee estimate can be selected', async ({ page }) => {
    await page.getByTestId(SharedComponentsSelectors.FeeToBePaidLabel).scrollIntoViewIfNeeded();
    await page.getByTestId(SharedComponentsSelectors.MiddleFeeEstimateItem).click();
    await page.getByTestId(SharedComponentsSelectors.LowFeeEstimateItem).click();
    const feeToBePaid = await page
      .getByTestId(SharedComponentsSelectors.FeeToBePaidLabel)
      .innerText();
    const fee = Number(feeToBePaid.split(' ')[0]);
    // Using min/max fee caps
    const isLowFee = fee >= 0.0025 && fee <= 0.5;
    test.expect(isLowFee).toBeTruthy();
  });
});
