import { Page } from 'playwright-core';
import { createTestSelector } from '../integration/utils';
import { ProfileUpdatingSelectors } from '../integration/profile/profile-updating.selector';

const selectors = {
  //$pageContainer: createTestSelector(ProfileUpdatingSelectors.ProfileUpdaterPageContainer),
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
}
