import { isString } from 'formik';
import * as yup from 'yup';

import type { NetworkModes } from '@leather-wallet/models';

import { checkEntityAddressIsCompliant } from '@app/query/common/compliance-checker/compliance-checker.query';

export function complianceValidator(
  shouldCheckCompliance: yup.StringSchema<string, yup.AnyObject>,
  network: NetworkModes
) {
  return yup.string().test({
    message: 'Compliance check failed',
    async test(value) {
      if (!isString(value)) return false;

      if (network !== 'mainnet') return true;

      if (!shouldCheckCompliance.isValidSync(value)) return true;

      try {
        const resp = await checkEntityAddressIsCompliant(value);
        return !resp.isOnSanctionsList;
      } catch (e) {
        return true;
      }
    },
  });
}
