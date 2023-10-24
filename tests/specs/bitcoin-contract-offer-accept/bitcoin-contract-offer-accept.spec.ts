import { BrowserContext, Page } from '@playwright/test';
import {
  TEST_BITCOIN_CONTRACT_ATTESTOR_URLS,
  TEST_BITCOIN_CONTRACT_COUNTERPARTYWALLETDETAILS,
  TEST_BITCOIN_CONTRACT_OFFER,
} from '@tests/mocks/constants';
import { BitcoinContractRequestSelectors } from '@tests/selectors/bitcoin-contract-request.selectors';
import { SettingsSelectors } from '@tests/selectors/settings.selectors';

import { test } from '../../fixtures/fixtures';

const requestParams = {
  bitcoinContractOffer: TEST_BITCOIN_CONTRACT_OFFER,
  attestorURLs: TEST_BITCOIN_CONTRACT_ATTESTOR_URLS,
  counterpartyWalletDetails: TEST_BITCOIN_CONTRACT_COUNTERPARTYWALLETDETAILS,
};

test.describe('Bitcoin Contract Request Test', () => {
  test.beforeEach(async ({ extensionId, globalPage, onboardingPage, homePage, page }) => {
    await globalPage.setupAndUseApiCalls(extensionId);
    await onboardingPage.signInWithTestAccount(extensionId);
    await homePage.clickSettingsButton();
    await page.getByTestId(SettingsSelectors.ChangeNetworkAction).click();
    await page.locator(`text="Testnet"`).click();
    await page.goto('https://leather.io');
    await page.waitForLoadState('networkidle');
  });

  function initiateOfferRequest(page: Page) {
    return async (requestParams: {
      bitcoinContractOffer: string;
      attestorURLs: string;
      counterpartyWalletDetails: string;
    }) =>
      page.evaluate(
        async params =>
          (window as any).HiroWalletProvider.request('acceptBitcoinContractOffer', params).catch(
            (e: unknown) => e
          ),
        requestParams
      );
  }

  async function clickReject(context: BrowserContext) {
    const popup = await context.waitForEvent('page');
    await popup.waitForTimeout(500);

    const rejectButton = popup.getByTestId(
      BitcoinContractRequestSelectors.BitcoinContractRejectButton
    );
    await rejectButton.click();
  }

  test('that the bitcoin contract offer is properly displayed', async ({ page, context }) => {
    const expectedOfferorName = 'DLC.Link';
    const expectedLockAmount = '0.0001 BTC';
    const expectedExpirationDate = '10/17/2023';

    initiateOfferRequest(page)(requestParams);

    const popup = await context.waitForEvent('page');

    const offerorText = await popup
      .getByTestId(BitcoinContractRequestSelectors.BitcoinContractOfferorText)
      .innerText();
    const warningLabel = popup.getByTestId(
      BitcoinContractRequestSelectors.BitcoinContractWarningLabel
    );
    const isWarningLabelVisible = await warningLabel.isVisible();
    const lockAmount = await popup
      .getByTestId(BitcoinContractRequestSelectors.BitcoinContractLockAmount)
      .innerText();
    const expirationDate = await popup
      .getByTestId(BitcoinContractRequestSelectors.BitcoinContractExpirationDate)
      .innerText();

    test.expect(offerorText).toContain(expectedOfferorName);
    test.expect(isWarningLabelVisible).toBeTruthy();
    test.expect(lockAmount).toEqual(expectedLockAmount);
    test.expect(expirationDate).toEqual(expectedExpirationDate);

    await popup.close();
  });

  test('that user can reject a bitcoin contract offer', async ({ page, context }) => {
    const [result] = await Promise.all([
      initiateOfferRequest(page)(requestParams),
      clickReject(context),
    ]);

    delete result.id;

    test.expect(result).toEqual({
      jsonrpc: '2.0',
      error: {
        code: 4001,
        message: 'Bitcoin Contract offer was rejected',
      },
    });
  });

  test(`that user can't accept a bitcoin contract offer without sufficient bitcoin'`, async ({
    page,
    context,
  }) => {
    initiateOfferRequest(page)(requestParams);

    const popup = await context.waitForEvent('page');
    await popup.waitForTimeout(500);

    const acceptButton = popup.getByTestId(
      BitcoinContractRequestSelectors.BitcoinContractAcceptButton
    );

    const isAcceptButtonDisabled = await acceptButton.isDisabled();

    test.expect(isAcceptButtonDisabled).toBeTruthy();

    await popup.close();
  });
});
