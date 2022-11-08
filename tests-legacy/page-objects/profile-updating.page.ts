import { ProfileUpdatingSelectors } from '@tests/integration/profile/profile-updating.selector';
import { Page } from 'playwright-core';
import { createTestSelector } from '../integration/utils';

const selectors = {
  $updateProfileBtn: createTestSelector(ProfileUpdatingSelectors.BtnUpdateProfile),
};

export class ProfileUpdatingPage {
  selectors = selectors;

  constructor(public page: Page) {}

  async select(selector: keyof typeof selectors) {
    return this.page.$(selectors[selector]);
  }

  async clickUpdateProfileButton() {
    return this.page.click(selectors.$updateProfileBtn);
  }

  async waitForError(msg: string) {
    return this.page.waitForSelector(`text=${msg}`);
  }
}
