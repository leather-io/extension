import { Page } from '@playwright/test';
import { ProfileUpdatingSelectors } from '@tests-legacy/integration/profile/profile-updating.selector';

import { createTestSelector } from '../integration/utils';

const selectors = {
  $updateProfileBtn: createTestSelector(ProfileUpdatingSelectors.BtnUpdateProfile),
};

export class ProfileUpdatingPage {
  selectors = selectors;

  page: Page;

  constructor(page: Page) {
    this.page = page;
  }

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
