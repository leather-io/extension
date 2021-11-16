// production environment= "production"
// local development = "development"
// preview release = "staging"
// feature branch (github PRs)= "feature"
// test environment = "test"

import { IS_TEST_ENV } from './constants';

function getEnvironment() {
  if (IS_TEST_ENV) return 'test';
  if (process.env.NODE_ENV === 'development') return 'development';
  if (!process.env.PREVIEW_RELEASE && !process.env.IS_PUBLISHING) return 'feature';
  if (process.env.PREVIEW_RELEASE) return 'staging';
  return 'production';
}

export const ENVIRONMENT = getEnvironment();
