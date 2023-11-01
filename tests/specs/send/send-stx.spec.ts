import {
  TEST_ACCOUNT_2_STX_ADDRESS,
  TEST_BNS_NAME,
  TEST_BNS_RESOLVED_ADDRESS,
  TEST_TESTNET_ACCOUNT_2_STX_ADDRESS,
} from '@tests/mocks/constants';
import { SendPage } from '@tests/page-object-models/send.page';
import { SharedComponentsSelectors } from '@tests/selectors/shared-component.selectors';
import { getDisplayerAddress } from '@tests/utils';

import { FormErrorMessages } from '@app/common/error-messages';

import { test } from '../../fixtures/fixtures';

test.describe('send stx', () => {
  test.describe.serial('tests on testnet', () => {
    const amount = '0.000001';
    let sPage: SendPage;
    test.beforeAll(async ({ extensionId, globalPage, onboardingPage, homePage, sendPage }) => {
      await globalPage.setupAndUseApiCalls(extensionId);
      await onboardingPage.signInWithTestAccount(extensionId);
      await homePage.enableTestMode();
      await homePage.sendButton.click();
      await sendPage.selectStxAndGoToSendForm();

      sPage = sendPage;
    });

    test('that send max button sets available balance minus fee', async () => {
      await sPage.amountInput.fill('.0001');
      await sPage.amountInput.clear();
      await sPage.amountInput.blur();
      await sPage.sendMaxButton.click();
      await sPage.amountInput.blur();
      test.expect(await sPage.amountInput.inputValue()).toBeTruthy();
      await sPage.goBackSelectStx();
    });

    test('that empty memo on preview matches default empty value', async () => {
      const emptyMemoPreviewValue = 'No memo';

      await sPage.amountInput.fill(amount);
      await sPage.recipientInput.fill(TEST_TESTNET_ACCOUNT_2_STX_ADDRESS);

      await sPage.previewSendTxButton.click();

      const confirmationMemo = await sPage.memoRow
        .getByTestId(SharedComponentsSelectors.InfoCardRowValue)
        .innerText();
      test.expect(confirmationMemo).toEqual(emptyMemoPreviewValue);
      await sPage.goBack();
    });

    test('that asset value, recipient, memo and fees on preview match input', async () => {
      const amountSymbol = 'STX';
      const memo = '123';
      await sPage.amountInput.fill(amount);
      await sPage.recipientInput.fill(TEST_TESTNET_ACCOUNT_2_STX_ADDRESS);
      await sPage.memoInput.fill(memo);

      const fees = await sPage.page
        .getByTestId(SharedComponentsSelectors.FeeToBePaidLabel)
        .innerText();
      await sPage.previewSendTxButton.click();

      const displayerAddress = await getDisplayerAddress(sPage.confirmationDetailsRecipient);

      test.expect(displayerAddress).toEqual(TEST_TESTNET_ACCOUNT_2_STX_ADDRESS);

      const confirmationAssetValue = await sPage.confirmationDetails
        .getByTestId(SharedComponentsSelectors.InfoCardAssetValue)
        .innerText();
      test.expect(confirmationAssetValue).toEqual(`${amount} ${amountSymbol}`);

      const confirmationFees = await sPage.feesRow
        .getByTestId(SharedComponentsSelectors.InfoCardRowValue)
        .innerText();
      test.expect(confirmationFees).toEqual(fees);

      const confirmationMemo2 = await sPage.memoRow
        .getByTestId(SharedComponentsSelectors.InfoCardRowValue)
        .innerText();
      test.expect(confirmationMemo2).toEqual(memo);
      await sPage.goBack();
    });

    test.describe('send form validation', () => {
      test.afterEach(async () => {
        await sPage.goBackSelectStx();
      });
      test('that the amount must be a number', async () => {
        await sPage.amountInput.fill('aaaaaa');
        await sPage.amountInput.blur();
        const errorMsg = await sPage.amountInputErrorLabel.innerText();
        test.expect(errorMsg).toBeTruthy();
      });

      test('that the amount must be positive', async () => {
        await sPage.amountInput.fill('-9999');
        await sPage.amountInput.blur();
        const errorMsg = await sPage.amountInputErrorLabel.innerText();
        test.expect(errorMsg).toEqual(FormErrorMessages.MustBePositive);
      });

      test('that the amount field enforces max length based on decimals', async () => {
        await sPage.amountInput.fill('0.0000001');
        await sPage.amountInput.blur();
        const errorMsg = await sPage.amountInputErrorLabel.innerText();
        test.expect(errorMsg).toEqual(FormErrorMessages.MustBePositive);
      });

      test('that the amount is greater than the available balance', async () => {
        await sPage.amountInput.fill('999999999');
        await sPage.amountInput.blur();
        const errorMsg = await sPage.amountInputErrorLabel.innerText();
        test.expect(errorMsg).toContain('Insufficient balance');
      });

      test('that the address must be valid', async () => {
        await sPage.recipientInput.fill('ST3TZVWsss4VTZA1WZN2TB6RQ5J8RACHZYMWMM2N1HT2');
        await sPage.recipientInput.blur();
        const errorMsg = await sPage.formInputErrorLabel.innerText();
        test.expect(errorMsg).toContain(FormErrorMessages.InvalidAddress);
      });

      test('that the address cannot be same as sender', async () => {
        await sPage.recipientChooseAccountButton.click();
        await sPage.page.getByTestId('switch-account-item-0').click();
        await sPage.previewSendTxButton.click();
        const errorMsg = await sPage.formInputErrorLabel.innerText();
        test.expect(errorMsg).toContain(FormErrorMessages.SameAddress);
      });

      test('that valid addresses are accepted', async () => {
        await sPage.amountInput.fill('0.000001');
        await sPage.recipientInput.fill(TEST_ACCOUNT_2_STX_ADDRESS);
        await sPage.previewSendTxButton.click();
        const details = await sPage.confirmationDetails.allInnerTexts();
        test.expect(details).toBeTruthy();
      });
    });

    test.describe('send form preview', () => {
      test.afterEach(async () => {
        await sPage.goBack();
        await sPage.goBackSelectStx();
      });
      test('that it shows preview of tx details to be confirmed', async () => {
        await sPage.amountInput.fill('0.000001');
        await sPage.recipientInput.fill(TEST_TESTNET_ACCOUNT_2_STX_ADDRESS);

        await sPage.previewSendTxButton.click();
        const details = await sPage.confirmationDetails.allInnerTexts();
        test.expect(details).toBeTruthy();
      });

      test('that it shows preview of tx details after validation error is resolved', async () => {
        await sPage.amountInput.fill('0.0000001');
        await sPage.recipientInput.fill(TEST_TESTNET_ACCOUNT_2_STX_ADDRESS);

        await sPage.previewSendTxButton.click();
        const errorMsg = await sPage.amountInputErrorLabel.innerText();
        test.expect(errorMsg).toEqual(FormErrorMessages.MustBePositive);
        await sPage.amountInput.fill('0.000001');
        await sPage.previewSendTxButton.click();
        const details = await sPage.confirmationDetails.allInnerTexts();
        test.expect(details).toBeTruthy();
      });
    });
  });

  // Those that can should be migrated to testnet tests
  test.describe.serial('tests on mainnet', () => {
    let sPage: SendPage;
    test.beforeAll(async ({ extensionId, globalPage, onboardingPage, homePage, sendPage }) => {
      await globalPage.setupAndUseApiCalls(extensionId);
      await onboardingPage.signInWithTestAccount(extensionId);
      await homePage.sendButton.click();
      await sendPage.selectStxAndGoToSendForm();

      sPage = sendPage;
    });

    test.afterEach(async () => {
      await sPage.goBack();
      await sPage.selectStxAndGoToSendForm();
    });

    test.describe('send form input fields', () => {
      test('that recipient address matches bns name', async () => {
        await sPage.amountInput.fill('.0001');
        await sPage.amountInput.blur();
        await sPage.recipientSelectFieldAddress.click();
        await sPage.recipientSelectFieldBnsName.click();
        await sPage.recipientInput.fill(TEST_BNS_NAME);
        await sPage.recipientInput.blur();
        await sPage.recipientBnsAddressLabel.waitFor();
        const bnsResolvedAddress = await sPage.page
          .getByText(TEST_BNS_RESOLVED_ADDRESS)
          .innerText();

        test.expect(bnsResolvedAddress).toBeTruthy();
      });

      test('that fee row defaults to middle fee estimation', async () => {
        const feeToBePaid = await sPage.page
          .getByTestId(SharedComponentsSelectors.FeeToBePaidLabel)
          .innerText();
        const fee = Number(feeToBePaid.split(' ')[0]);
        // Using min/max fee caps
        const isMiddleFee = fee >= 0.003 && fee <= 0.75;
        test.expect(isMiddleFee).toBeTruthy();
      });

      test('that low fee estimate can be selected', async () => {
        await sPage.page.getByTestId(SharedComponentsSelectors.MiddleFeeEstimateItem).click();
        await sPage.page.getByTestId(SharedComponentsSelectors.LowFeeEstimateItem).click();
        const feeToBePaid = await sPage.page
          .getByTestId(SharedComponentsSelectors.FeeToBePaidLabel)
          .innerText();
        const fee = Number(feeToBePaid.split(' ')[0]);
        // Using min/max fee caps
        const isLowFee = fee >= 0.0025 && fee <= 0.5;
        test.expect(isLowFee).toBeTruthy();
      });
    });
  });
});
