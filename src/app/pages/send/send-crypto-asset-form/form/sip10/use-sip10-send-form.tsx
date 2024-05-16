import { useMemo } from 'react';

import type { CryptoAssetBalance, Sip10CryptoAssetInfo } from '@leather-wallet/models';
import { FormikHelpers } from 'formik';
import * as yup from 'yup';

import { logger } from '@shared/logger';
import { StacksSendFormValues } from '@shared/models/form.model';

import { convertAmountToBaseUnit } from '@app/common/money/calculate-money';
import { getSafeImageCanonicalUri } from '@app/common/stacks-utils';
import { stacksFungibleTokenAmountValidator } from '@app/common/validation/forms/amount-validators';
import { useCalculateStacksTxFees } from '@app/query/stacks/fees/fees.hooks';
import {
  useFtTokenTransferUnsignedTx,
  useGenerateFtTokenTransferUnsignedTx,
} from '@app/store/transactions/token-transfer.hooks';

import { useSendFormNavigate } from '../../hooks/use-send-form-navigate';
import { useStacksCommonSendForm } from '../stacks/use-stacks-common-send-form';

interface UseSip10SendFormArgs {
  assetInfo: Sip10CryptoAssetInfo;
  balance: CryptoAssetBalance;
}
export function useSip10SendForm({ assetInfo, balance }: UseSip10SendFormArgs) {
  const generateTx = useGenerateFtTokenTransferUnsignedTx(assetInfo);

  const sendFormNavigate = useSendFormNavigate();

  const unsignedTx = useFtTokenTransferUnsignedTx(assetInfo);
  const { data: stacksFtFees } = useCalculateStacksTxFees(unsignedTx);

  const availableTokenBalance = balance.availableBalance;
  const sendMaxBalance = useMemo(
    () => convertAmountToBaseUnit(availableTokenBalance),
    [availableTokenBalance]
  );

  const { initialValues, checkFormValidation, recipient, memo, nonce } = useStacksCommonSendForm({
    symbol: assetInfo.symbol,
    availableTokenBalance,
  });

  function createFtAvatar() {
    return {
      avatar: assetInfo.contractId,
      imageCanonicalUri: getSafeImageCanonicalUri(assetInfo.imageCanonicalUri, assetInfo.name),
    };
  }

  return {
    availableTokenBalance,
    initialValues,
    sendMaxBalance,
    stacksFtFees,
    symbol: assetInfo.symbol,
    decimals: assetInfo.decimals,
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
        decimals: assetInfo.decimals,
        name: assetInfo.name,
        tx,
      });
    },
  };
}
