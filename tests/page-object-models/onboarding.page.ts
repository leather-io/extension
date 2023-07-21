import { Page } from '@playwright/test';
import { TEST_PASSWORD, TEST_SECRET_KEY } from '@tests/mocks/constants';
import { HomePageSelectors } from '@tests/selectors/home.selectors';
import { OnboardingSelectors } from '@tests/selectors/onboarding.selectors';

import { RouteUrls } from '@shared/route-urls';

// If default wallet state changes, we'll need to update this
export const testSoftwareAccountDefaultWalletState = {
  analytics: { hasStxDeposits: { '1': true, '2147483648': true } },
  chains: { stx: { default: { highestAccountIndex: 16, currentAccountIndex: 0 } } },
  keys: {
    ids: ['default'],
    entities: {
      default: {
        type: 'software',
        id: 'default',
        salt: 'b71b4553596cc9d27da47d71e07fd979',
        encryptedSecretKey:
          '2d1cf9fa81f73274c802f0cdc38548530660f5998a8ab7b77229366cd18a38953f393561985953eff554a8fd5d37120cb57b8850d3b898dc7f8f0d54fd087f7dfb42f642a9cd9fc3b6185bff370d0918dac70766db8827066578629462fc8b18',
      },
    },
  },
  ledger: {
    bitcoin: {
      entities: {},
      ids: [],
    },
  },
  networks: { ids: [], entities: {}, currentNetworkId: 'mainnet' },
  onboarding: {
    hideSteps: true,
    stepsStatus: {
      'Back up secret key': 1,
      'Add some funds': 0,
      'Explore apps': 0,
      'Buy an NFT': 0,
    },
  },
  ordinals: {
    entities: {},
    ids: [],
  },
  settings: { userSelectedTheme: 'system', hasAllowedAnalytics: false, dismissedMessages: [] },
  _persist: { version: 1, rehydrated: true },
};

const testLedgerAccountDefaultWalletState = {
  _persist: { rehydrated: true, version: 1 },
  analytics: { hasStxDeposits: { '1': false, '2147483648': true } },
  chains: { stx: { default: { currentAccountIndex: 0, highestAccountIndex: 0 } } },
  keys: {
    entities: {
      default: {
        id: 'default',
        publicKeys: [
          {
            dataPublicKey:
              '044b6fdad95384e953804821151cbc98f0131d08b0595b9da722bf7ca285a1f4fe50e43f881ead4031eb721b4f10cd227d2a9a19bac5b985bf414e598ac9b411d3',
            stxPublicKey: '021818dd91f5342e3b366abc0734fc5a05a8eb5bf28d43dd122d8d1ffcc664bcea',
          },
          {
            dataPublicKey:
              '04798cb7cd3eafede5e59d530d574c70a374a15e14a9a1e81a8659cdcac1b2334be67d21275bfb2dcb383b0427999c7091c586786c61e7e3fca5e0118d7eb10f33',
            stxPublicKey: '03dabcfe8913a49c66e80ddc8994855a5dc30288830f5c444b3fb776e2bb5d4332',
          },
          {
            dataPublicKey:
              '0405a7f454cbbb2eb56a48048b490d9d2d3e27f9eeec93437b6c16729c4571a9951c3255ba6295bf19fd74d939d70058ae51d4dad76c50ec5ff9e18bd08860a050',
            stxPublicKey: '0256723bcb20d7628f10108139d1160d5f288b1bc91906fb034bf48007ddf5376e',
          },
          {
            dataPublicKey:
              '04ead5999a6da792d29b5dcb552284a68175cf8011743241a901655eebee063ffd7285536138dccfa93bcf4245258b0ba79a85c40ab4c3358d326f7535d60efb01',
            stxPublicKey: '034b1553ecaee148cf191cc7c893da9265865327a15d25655608b2d57e64c45b20',
          },
          {
            dataPublicKey:
              '0460ca5664c241224586b707c71f8fc0fb6d801926b32baec3ce85b75b920e651dd56949ee348cd8d3afe57e1b65eed150ad1c89b2e465edd1b93767e1cbad699e',
            stxPublicKey: '020b0c3083f734922997d3224a543fc29b1dcb255e95667868b351ec08b919095c',
          },
        ],
        type: 'ledger',
      },
    },
    ids: ['default'],
  },
  networks: { currentNetworkId: 'mainnet', entities: {}, ids: [] },
  onboarding: {
    hideSteps: false,
    stepsStatus: {
      'Add some funds': 0,
      'Back up secret key': 1,
      'Buy an NFT': 0,
      'Explore apps': 0,
    },
  },
  settings: { dismissedMessages: [], hasAllowedAnalytics: false, userSelectedTheme: 'system' },
};

export class OnboardingPage {
  constructor(readonly page: Page) {}

  async denyAnalytics() {
    await this.page.getByTestId(OnboardingSelectors.DenyAnalyticsBtn).click();
    await this.page.waitForURL('**' + RouteUrls.Onboarding);
  }

  async setPassword() {
    await this.page.waitForURL('**' + RouteUrls.SetPassword);
    await this.page.getByTestId(OnboardingSelectors.NewPasswordInput).fill(TEST_PASSWORD);
    await this.page.waitForTimeout(100);
    await this.page.getByTestId(OnboardingSelectors.SetPasswordBtn).click();
  }

  async signUpNewUser() {
    await this.denyAnalytics();
    await this.page.getByTestId(OnboardingSelectors.SignUpBtn).click();
    await this.page.waitForURL('**' + RouteUrls.BackUpSecretKey);
    await this.page.getByTestId(OnboardingSelectors.BackUpSecretKeyBtn).click();
    await this.setPassword();
  }

  /**
   * Use this to test the onboarding flow by going through step-by-step
   */
  async signInExistingUser() {
    await this.denyAnalytics();
    await this.page.getByTestId(OnboardingSelectors.SignInLink).click();
    await this.page.getByTestId(OnboardingSelectors.SecretKeyInput).fill(TEST_SECRET_KEY);
    await this.page.getByTestId(OnboardingSelectors.SignInBtn).click();
    await this.setPassword();
    await this.page.waitForURL('**' + RouteUrls.Home);
    await this.page.getByTestId(HomePageSelectors.HomePageContainer).waitFor();
  }

  /**
   * Use this for tests that just need to be signed in. This will skip the
   * onboarding flow and initialise the wallet in a signed in state for the test
   * account
   */
  async signInWithTestAccount(id: string) {
    await this.page.evaluate(
      walletState => chrome.storage.local.set({ 'persist:root': walletState }),
      testSoftwareAccountDefaultWalletState
    );
    await this.page.goto(`chrome-extension://${id}/index.html`);
    await this.page.getByRole('textbox').type(TEST_PASSWORD);
    await this.page.getByRole('button', { name: 'Continue' }).click();
    await this.page.waitForURL('**' + RouteUrls.Home);
    await this.page.locator('text="Account 1"').waitFor();
  }

  /**
   * Use this for tests that just need to be signed in. This will skip the
   * onboarding flow and initialise the wallet in a signed in state for the test
   * account
   */
  async signInWithLedgerAccount(id: string) {
    await this.page.evaluate(
      async walletState => chrome.storage.local.set({ 'persist:root': walletState }),
      testLedgerAccountDefaultWalletState
    );
    await this.page.goto(`chrome-extension://${id}/index.html`);
  }
}
