import { Page } from '@playwright/test';
import { TestAppSelectors } from '@tests/selectors/test-app.selectors';
import { createTestSelector } from '@tests/utils';

export class ProfileUpdatingPage {
  readonly updateProfileBtnSelector = createTestSelector(TestAppSelectors.BtnUpdateProfile);

  constructor(readonly page: Page) {}

  async clickUpdateProfileButton() {
    return this.page.click(this.updateProfileBtnSelector);
  }

  async waitForError(msg: string) {
    return this.page.waitForSelector(`text=${msg}`);
  }
}
