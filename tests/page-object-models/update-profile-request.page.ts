import { Page } from '@playwright/test';
import { UpdateProfileRequestSelectors } from '@tests/selectors/requests.selectors';
import { createTestSelector } from '@tests/utils';

export class UpdateProfileRequestPage {
  readonly updateProfileBtnSelector = createTestSelector(
    UpdateProfileRequestSelectors.BtnUpdateProfile
  );

  constructor(readonly page: Page) {}

  async clickUpdateProfileButton() {
    return this.page.click(this.updateProfileBtnSelector);
  }

  async waitForUpdateProfileRequestError(msg: string) {
    return this.page.waitForSelector(`text=${msg}`);
  }
}
