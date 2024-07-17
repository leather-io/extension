import * as yup from 'yup';

import type { NetworkModes } from '@leather.io/models';
import { isEmptyString, isUndefined } from '@leather.io/utils';

import { checkEntityAddressIsCompliant } from '@app/query/common/compliance-checker/compliance-checker.query';

export function complianceValidator(
  shouldCheckCompliance: yup.StringSchema<string | undefined, yup.AnyObject>,
  network: NetworkModes
) {
  return yup.string().test({
    message: 'Compliance check failed',
    async test(value) {
      if (network !== 'mainnet') return true;
      if (!shouldCheckCompliance.isValidSync(value)) return true;
      if (isUndefined(value) || isEmptyString(value)) return true;

      try {
        const resp = await checkEntityAddressIsCompliant(value);
        return !resp.isOnSanctionsList;
      } catch (e) {
        return true;
      }
    },
  });
}
