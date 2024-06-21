import { useMemo } from 'react';

import { FormikHelpers } from 'formik';
import * as yup from 'yup';

import type { CryptoAssetBalance, Sip10CryptoAssetInfo } from '@leather.io/models';
import { useCalculateStacksTxFees } from '@leather.io/query';
import { convertAmountToBaseUnit } from '@leather.io/utils';

import { logger } from '@shared/logger';
import { StacksSendFormValues } from '@shared/models/form.model';

import { getSafeImageCanonicalUri } from '@app/common/stacks-utils';
import { stacksFungibleTokenAmountValidator } from '@app/common/validation/forms/amount-validators';
import {
  useFtTokenTransferUnsignedTx,
  useGenerateFtTokenTransferUnsignedTx,
} from '@app/store/transactions/token-transfer.hooks';

import { useStacksCommonSendForm } from '../../family/stacks/use-stacks-common-send-form';
import { useSendFormNavigate } from '../../hooks/use-send-form-navigate';

interface UseSip10SendFormArgs {
  balance: CryptoAssetBalance;
  info: Sip10CryptoAssetInfo;
}
export function useSip10SendForm({ balance, info }: UseSip10SendFormArgs) {
  const generateTx = useGenerateFtTokenTransferUnsignedTx(info);

  const sendFormNavigate = useSendFormNavigate();

  const unsignedTx = useFtTokenTransferUnsignedTx(info);
  const { data: stacksFtFees } = useCalculateStacksTxFees(unsignedTx);

  const availableTokenBalance = balance.availableBalance;
  const sendMaxBalance = useMemo(
    () => convertAmountToBaseUnit(availableTokenBalance),
    [availableTokenBalance]
  );

  const { initialValues, checkFormValidation, recipient, memo, nonce } = useStacksCommonSendForm({
    symbol: info.symbol,
    availableTokenBalance,
  });

  function createFtAvatar() {
    return {
      avatar: info.contractId,
      imageCanonicalUri: getSafeImageCanonicalUri(info.imageCanonicalUri, info.name),
    };
  }

  return {
    availableTokenBalance,
    initialValues,
    sendMaxBalance,
    stacksFtFees,
    symbol: info.symbol,
    decimals: info.decimals,
    avatar: createFtAvatar(),
    validationSchema: yup.object({
      amount: stacksFungibleTokenAmountValidator(availableTokenBalance),
      recipient,
      memo,
      nonce,
    }),

    async previewTransaction(
      values: StacksSendFormValues,
      formikHelpers: FormikHelpers<StacksSendFormValues>
    ) {
      const isFormValid = await checkFormValidation(values, formikHelpers);
      if (!isFormValid) return;

      const tx = await generateTx(values);
      if (!tx) return logger.error('Attempted to generate unsigned tx, but tx is undefined');

      sendFormNavigate.toConfirmAndSignStacksSip10Transaction({
        decimals: info.decimals,
        name: info.name,
        tx,
      });
    },
  };
}
