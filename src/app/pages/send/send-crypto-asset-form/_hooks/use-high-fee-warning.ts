import { useCallback } from 'react';

import { FormikErrors } from 'formik';

import { HIGH_FEE_AMOUNT_STX } from '@shared/constants';
import { StacksSendFormValues } from '@shared/models/form.model';
import { isEmpty } from '@shared/utils';

import { useDrawers } from '@app/common/hooks/use-drawers';

export function useHighFeeWarning() {
  const { isShowingHighFeeConfirmation, setIsShowingHighFeeConfirmation } = useDrawers();

  const shouldFormShowHighFeeWarning = useCallback(
    (formErrors: Promise<FormikErrors<StacksSendFormValues>>, values: StacksSendFormValues) => {
      if (isEmpty(formErrors) && values.fee > HIGH_FEE_AMOUNT_STX) {
        // TODO: Refactor to use a route
        return setIsShowingHighFeeConfirmation(!isShowingHighFeeConfirmation);
      }
    },
    [isShowingHighFeeConfirmation, setIsShowingHighFeeConfirmation]
  );

  return shouldFormShowHighFeeWarning;
}
