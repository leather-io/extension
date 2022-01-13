import { BrowserDriver, createTestSelector, setupBrowser } from '../utils';
import { MAGIC_RECOVERY_KEY, MAGIC_RECOVERY_PASSWORD, SECRET_KEY } from '../../mocks';
import { WalletPage } from '../../page-objects/wallet.page';
import { SettingsSelectors } from '../settings.selectors';
import { RouteUrls } from '@shared/route-urls';

jest.setTimeout(30_000);
jest.retryTimes(process.env.CI ? 2 : 0);

describe(`Onboarding integration tests`, () => {
  let browser: BrowserDriver;
  let wallet: WalletPage;

  beforeEach(async () => {
    browser = await setupBrowser();
    wallet = await WalletPage.init(browser, RouteUrls.Onboarding);
  }, 20000);

  afterEach(async () => {
    try {
      await browser.context.close();
    } catch (error) {}
  });

  it('should be able to allow analytics', async () => {
    await wallet.clickAllowAnalytics();
    await wallet.waitForWelcomePage();
  });

  it('should be able to sign up from welcome page', async () => {
    await wallet.clickDenyAnalytics();
    await wallet.clickSignUp();
    await wallet.backUpKeyAndSetPassword();
    await wallet.waitForHomePage();
    await wallet.goToSecretKey();
    const secretKey = await wallet.getSecretKey();
    expect(secretKey).not.toBeFalsy();
    expect(secretKey.split(' ').length).toEqual(24);
  });

  it('should be able to login from welcome page then logout', async () => {
    await wallet.clickDenyAnalytics();
    await wallet.clickSignIn();
    await wallet.loginWithPreviousSecretKey(SECRET_KEY);
    await wallet.waitForHomePage();
    const secretKey = await wallet.getSecretKey();
    expect(secretKey).toEqual(SECRET_KEY);
    await wallet.clickSettingsButton();
    const signoutBtn = await wallet.page.$('text=Sign Out');
    expect(signoutBtn).toBeTruthy();
    await wallet.page.click('text=Sign Out');
    await wallet.page.click(wallet.$signOutConfirmHasBackupCheckbox);
    await wallet.page.click(wallet.$signOutDeleteWalletBtn);
    await wallet.waitForWelcomePage();
  });

  it('should route to unlock page if the wallet is locked', async () => {
    await wallet.clickDenyAnalytics();
    await wallet.clickSignUp();
    await wallet.backUpKeyAndSetPassword();
    await wallet.waitForHomePage();
    await wallet.clickSettingsButton();
    await wallet.page.click(createTestSelector(SettingsSelectors.LockListItem));
    await wallet.waitForHiroWalletLogo();
    await wallet.page.click(wallet.$hiroWalletLogo);
    await wallet.waitForEnterPasswordInput();
  });

  it('should be able to login from Magic Recovery Code', async () => {
    await wallet.clickDenyAnalytics();
    await wallet.clickSignIn();
    await wallet.enterSecretKey(MAGIC_RECOVERY_KEY);
    await wallet.waitForMagicRecoveryMessage();
    const magicRecoveryElement = await wallet.page.$$(wallet.$magicRecoveryMessage);
    const magicRecoveryMessage = await magicRecoveryElement[0].innerText();
    expect(magicRecoveryMessage).toEqual(
      'You entered a Magic Recovery Code. Enter the password you set when you first created your Blockstack ID.'
    );
    await wallet.decryptRecoveryCode(MAGIC_RECOVERY_PASSWORD);
    await wallet.enterNewPassword('lksjdflksjlfkjsdlfjsldf');
    await wallet.enterConfirmPasswordAndClickDone('lksjdflksjlfkjsdlfjsldf');
    await wallet.waitForHomePage();
    const homePageVisible = await wallet.page.isVisible(wallet.$homePageBalancesList);
    expect(homePageVisible).toBeTruthy();
  });

  it('should show onboarding steps for a new wallet with only one account', async () => {
    await wallet.clickDenyAnalytics();
    await wallet.clickSignUp();
    await wallet.backUpKeyAndSetPassword();
    await wallet.waitForHomePage();
    await wallet.waitForHideOnboardingsStepsButton();
  });

  it('should hide onboarding steps when signing in with an existing secret key', async () => {
    await wallet.clickDenyAnalytics();
    await wallet.clickSignIn();
    await wallet.loginWithPreviousSecretKey(SECRET_KEY);
    await wallet.waitForHomePage();
    const onboardingStepsVisible = await wallet.page.isVisible(wallet.$onboardingStepsList);
    expect(onboardingStepsVisible).toBeFalsy();
  });

  it('should hide onboarding steps if user clicks the button to hide them', async () => {
    await wallet.clickDenyAnalytics();
    await wallet.clickSignUp();
    await wallet.backUpKeyAndSetPassword();
    await wallet.waitForHomePage();
    await wallet.waitForHideOnboardingsStepsButton();
    await wallet.clickHideSteps();
  });

  it('should be able to start and complete an onboarding step in the list', async () => {
    await wallet.clickDenyAnalytics();
    await wallet.clickSignUp();
    await wallet.backUpKeyAndSetPassword();
    await wallet.waitForHomePage();
    await wallet.waitForOnboardingStepsList();
    const stepsToStartBtns = await wallet.page.$$(wallet.$onboardingStepStartBtn);
    await stepsToStartBtns[1].click();
    const stepsDone = await wallet.page.$$(wallet.$onboardingStepDoneBadge);
    expect(stepsDone.length).toEqual(2);
  });

  it('should be able to use the link to add funds if balances list has no assets', async () => {
    await wallet.clickDenyAnalytics();
    await wallet.clickSignUp();
    await wallet.backUpKeyAndSetPassword();
    await wallet.waitForHomePage();
    await wallet.waitForOnboardingStepsList();
    const noAssetsFundAccountLink = await wallet.page.$(wallet.$noAssetsFundAccountLink);
    await noAssetsFundAccountLink?.click();
  });
});
