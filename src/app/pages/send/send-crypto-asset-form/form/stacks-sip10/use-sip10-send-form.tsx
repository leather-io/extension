import { useMemo } from 'react';

import { FormikHelpers } from 'formik';
import * as yup from 'yup';

import { logger } from '@shared/logger';
import { StacksSendFormValues } from '@shared/models/form.model';

import { getImageCanonicalUri } from '@app/common/crypto-assets/stacks-crypto-asset.utils';
import { convertAmountToBaseUnit } from '@app/common/money/calculate-money';
import { formatContractId } from '@app/common/utils';
import { stacksFungibleTokenAmountValidator } from '@app/common/validation/forms/amount-validators';
import { useStacksFungibleTokenAssetBalance } from '@app/query/stacks/balance/stacks-ft-balances.hooks';
import { useCalculateStacksTxFees } from '@app/query/stacks/fees/fees.hooks';
import {
  useFtTokenTransferUnsignedTx,
  useGenerateFtTokenTransferUnsignedTx,
} from '@app/store/transactions/token-transfer.hooks';

import { useSendFormNavigate } from '../../hooks/use-send-form-navigate';
import { useStacksCommonSendForm } from '../stacks/use-stacks-common-send-form';

interface UseSip10SendFormArgs {
  symbol: string;
  contractId: string;
}
export function useSip10SendForm({ symbol, contractId }: UseSip10SendFormArgs) {
  const assetBalance = useStacksFungibleTokenAssetBalance(contractId);
  const generateTx = useGenerateFtTokenTransferUnsignedTx(assetBalance);

  const sendFormNavigate = useSendFormNavigate();

  const unsignedTx = useFtTokenTransferUnsignedTx(assetBalance);
  const { data: stacksFtFees } = useCalculateStacksTxFees(unsignedTx);

  const availableTokenBalance = assetBalance.balance;
  const sendMaxBalance = useMemo(
    () => convertAmountToBaseUnit(availableTokenBalance),
    [availableTokenBalance]
  );

  const { initialValues, checkFormValidation, recipient, memo, nonce } = useStacksCommonSendForm({
    symbol,
    availableTokenBalance,
  });

  function createFtAvatar() {
    const asset = assetBalance.asset;

    const { contractAddress, contractAssetName, contractName } = asset;
    return {
      avatar: `${formatContractId(contractAddress, contractName)}::${contractAssetName}`,
      imageCanonicalUri: getImageCanonicalUri(asset.imageCanonicalUri, asset.name),
    };
  }

  return {
    availableTokenBalance,
    initialValues,
    sendMaxBalance,
    stacksFtFees,
    symbol,
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
        decimals: assetBalance.balance.decimals,
        name: assetBalance.asset.name,
        tx,
      });
    },
  };
}
