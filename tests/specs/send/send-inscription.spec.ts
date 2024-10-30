import { TEST_TESTNET_ACCOUNT_2_TAPROOT_ADDRESS } from '@tests/mocks/constants';
import { mockTestnetTestAccountInscriptionsRequests } from '@tests/mocks/mock-inscriptions-bis';
import { mockTestnetTestAccountEmptyUtxosRequests } from '@tests/mocks/mock-utxos';
import { SendCryptoAssetSelectors } from '@tests/selectors/send.selectors';
import { getDisplayerAddress } from '@tests/utils';

import { BtcFeeType } from '@leather.io/models';
import { mockInscriptionResponse3, mockInscriptionResponseNonZeroOffset } from '@leather.io/query';

import { FormErrorMessages } from '@shared/error-messages';

import { test } from '../../fixtures/fixtures';

const mockInscriptionResp = {
  ...mockInscriptionResponse3,
  owner_wallet_addr: TEST_TESTNET_ACCOUNT_2_TAPROOT_ADDRESS,
};

test.describe('Send inscription', () => {
  test.beforeEach(async ({ extensionId, globalPage, onboardingPage }) => {
    await globalPage.setupAndUseApiCalls(extensionId);
    await onboardingPage.signInWithTestAccount(extensionId);
    await mockTestnetTestAccountInscriptionsRequests(globalPage.page, [mockInscriptionResp]);
  });

  test.describe('valid send inscription data', () => {
    test('should show the inscription review step', async ({ sendPage, homePage }) => {
      await homePage.selectTestnet();
      await sendPage.selectInscription();
      await sendPage.recipientInput.fill(TEST_TESTNET_ACCOUNT_2_TAPROOT_ADDRESS);
      const inscriptionSendButton = sendPage.page.getByTestId(
        SendCryptoAssetSelectors.PreviewSendTxBtn
      );
      await inscriptionSendButton.click();
      await sendPage.feesListItem.filter({ hasText: BtcFeeType.Low }).click();
      const displayerAddress = await getDisplayerAddress(sendPage.confirmationDetailsRecipient);
      test.expect(displayerAddress).toEqual(TEST_TESTNET_ACCOUNT_2_TAPROOT_ADDRESS);
    });
  });

  test.describe('validation errors', () => {
    test('should show the insufficient balance error', async ({
      globalPage,
      homePage,
      sendPage,
    }) => {
      await mockTestnetTestAccountEmptyUtxosRequests(globalPage.page);
      await homePage.selectTestnet();
      await sendPage.selectInscription();

      await sendPage.recipientInput.fill(TEST_TESTNET_ACCOUNT_2_TAPROOT_ADDRESS);
      const inscriptionSendButton = sendPage.page.getByTestId(
        SendCryptoAssetSelectors.PreviewSendTxBtn
      );
      await inscriptionSendButton.click();

      const errorLabel = await sendPage.formInputErrorLabel.textContent();
      test.expect(errorLabel).toContain(FormErrorMessages.InsufficientFunds);
    });

    test('should show invalid address error', async ({ homePage, sendPage }) => {
      await homePage.selectTestnet();
      await sendPage.selectInscription();

      await sendPage.recipientInput.fill('123');
      const inscriptionSendButton = sendPage.page.getByTestId(
        SendCryptoAssetSelectors.PreviewSendTxBtn
      );
      await inscriptionSendButton.click();

      const errorMsg = await sendPage.formInputErrorLabel.textContent();
      test.expect(errorMsg).toContain(FormErrorMessages.InvalidAddress);
    });

    test('should show non-zero offset inscription error', async ({
      globalPage,
      homePage,
      sendPage,
    }) => {
      await mockTestnetTestAccountInscriptionsRequests(globalPage.page, [
        {
          ...mockInscriptionResponseNonZeroOffset,
          owner_wallet_addr: TEST_TESTNET_ACCOUNT_2_TAPROOT_ADDRESS,
        },
      ]);
      await homePage.selectTestnet();
      await sendPage.selectInscription();

      await sendPage.recipientInput.fill(TEST_TESTNET_ACCOUNT_2_TAPROOT_ADDRESS);
      const inscriptionSendButton = sendPage.page.getByTestId(
        SendCryptoAssetSelectors.PreviewSendTxBtn
      );
      await inscriptionSendButton.click();

      const errorLabel = await sendPage.formInputErrorLabel.textContent();
      test.expect(errorLabel).toContain(FormErrorMessages.NonZeroOffsetInscription);
    });
  });

  test('should show multiple inscription on utxo error', async ({
    globalPage,
    homePage,
    sendPage,
  }) => {
    await mockTestnetTestAccountInscriptionsRequests(globalPage.page, [
      mockInscriptionResp,
      mockInscriptionResp,
    ]);
    await homePage.selectTestnet();
    await sendPage.selectInscription();

    await sendPage.recipientInput.fill(TEST_TESTNET_ACCOUNT_2_TAPROOT_ADDRESS);
    const inscriptionSendButton = sendPage.page.getByTestId(
      SendCryptoAssetSelectors.PreviewSendTxBtn
    );
    await inscriptionSendButton.click();

    const errorLabel = await sendPage.formInputErrorLabel.textContent();
    test.expect(errorLabel).toContain(FormErrorMessages.UtxoWithMultipleInscriptions);
  });
});
