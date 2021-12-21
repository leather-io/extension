import { BrowserDriver, createTestSelector, getCurrentTestName, setupBrowser } from '../utils';
import { WalletPage } from '@tests/page-objects/wallet.page';
import { DemoPage } from '@tests/page-objects/demo.page';
import { RouteUrls } from '@shared/route-urls';
import { SECRET_KEY_2 } from '@tests/mocks';
import { TransactionSigningPage } from '@tests/page-objects/transaction-signing.page';
import { TransactionSigningSelectors } from '@tests/page-objects/transaction-signing.selectors';
import { Page } from 'playwright';
import { deserializeTransaction, TokenTransferPayload } from '@stacks/transactions';
import { stxToMicroStx } from '@app/common/stacks-utils';

jest.setTimeout(120_000);
jest.retryTimes(process.env.CI ? 2 : 0);

describe(`Transaction signing`, () => {
  let browser: BrowserDriver;
  let wallet: WalletPage;
  let demo: DemoPage;

  beforeEach(async () => {
    browser = await setupBrowser();
    await browser.context.tracing.start({ screenshots: true, snapshots: true });
    wallet = await WalletPage.init(browser, RouteUrls.Onboarding);
    demo = browser.demo;
    await wallet.clickAllowAnalytics();
  });

  afterEach(async () => {
    try {
      await browser.context.tracing.stop({
        path: `trace-${getCurrentTestName()}.trace.zip`,
      });
      await browser.context.close();
    } catch (error) {
      console.log(error);
    }
  });

  describe('New created wallet scenarios', () => {
    beforeEach(async () => {
      await wallet.signUp();
      await demo.page.reload();
      const [popup] = await Promise.all([
        browser.context.waitForEvent('page'),
        browser.demo.openConnect(),
      ]);
      const [response] = await Promise.all([
        popup.waitForNavigation(),
        popup.click(createTestSelector('account-account-1-0')),
      ]);
      if (response) console.log(response);
      await wallet.page.close();
      await demo.page.bringToFront();
    });

    it('should load contract call button', async () => {
      const buttonText = await demo.page.textContent(
        createTestSelector(TransactionSigningSelectors.BtnContractCall)
      );
      expect(buttonText).toContain('Contract call');
    });

    it('validates against insufficient funds when performing a contract call', async () => {
      const [popup] = await Promise.all([
        browser.context.waitForEvent('page'),
        demo.page.click(createTestSelector(TransactionSigningSelectors.BtnContractCall)),
      ]);
      const errorMsg = await popup.textContent(
        createTestSelector(TransactionSigningSelectors.TransactionErrorMessage)
      );
      expect(errorMsg).toBeTruthy();
    });
  });

  describe('app initiated STX transfer', () => {
    let txSigningPage: TransactionSigningPage;

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

    beforeEach(async () => {
      await wallet.signIn(SECRET_KEY_2);
      await demo.page.reload();
      const [popup] = await Promise.all([
        browser.context.waitForEvent('page'),
        browser.demo.openConnect(),
      ]);
      await Promise.all([
        popup.waitForNavigation(),
        popup.click(createTestSelector('account-account-1-0')),
      ]);
      await wallet.page.close();
      await demo.page.bringToFront();
      const [txPage] = await Promise.all([
        browser.context.waitForEvent('page'),
        demo.page.click('text=STX transfer'),
      ]);
      txSigningPage = new TransactionSigningPage(txPage);
    });

    it('broadcasts correctly with given fee and amount', async () => {
      await txSigningPage.waitForPageToRender();
      await txSigningPage.waitForFeeEstimationsToLoad();

      const displayedFee = await txSigningPage.getDisplayedFeeValue();

      if (!displayedFee) throw new Error('Cannot pull fee from UI');

      const [_, requestBody] = await Promise.all([
        txSigningPage.clickBroadcastTxButton(),
        interceptTransactionBroadcast(txSigningPage.page),
      ]);
      const deserialisedTx = deserializeTransaction(requestBody);
      const payload = deserialisedTx.payload as TokenTransferPayload;
      const amount = Number(payload.amount);
      const fee = Number(deserialisedTx.auth.spendingCondition?.fee);

      const parsedDisplayedFee = parseFloat(displayedFee.replace(' STX', ''));
      expect(fee).toEqual(stxToMicroStx(parsedDisplayedFee).toNumber());

      expect(amount).toEqual(102);
    });
  });
});
