import { useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';

import { FormikHelpers } from 'formik';
import * as yup from 'yup';

import { HIGH_FEE_AMOUNT_STX } from '@shared/constants';
import { logger } from '@shared/logger';
import { FeeTypes } from '@shared/models/fees/_fees.model';
import { StacksSendFormValues } from '@shared/models/form.model';
import { createMoney } from '@shared/models/money.model';
import { isEmpty } from '@shared/utils';

import { FormErrorMessages } from '@app/common/error-messages';
import { useDrawers } from '@app/common/hooks/use-drawers';
import { useOnMount } from '@app/common/hooks/use-on-mount';
import { convertAmountToBaseUnit } from '@app/common/money/calculate-money';
import { useWalletType } from '@app/common/use-wallet-type';
import { stacksFungibleTokenAmountValidator } from '@app/common/validation/forms/amount-validators';
import { stxMemoValidator } from '@app/common/validation/forms/memo-validators';
import { stxRecipientValidator } from '@app/common/validation/forms/recipient-validators';
import { nonceValidator } from '@app/common/validation/nonce-validators';
import { useLedgerNavigate } from '@app/features/ledger/hooks/use-ledger-navigate';
import { useStacksFungibleTokenAssetBalance } from '@app/query/stacks/balance/stacks-ft-balances.hooks';
import { useCalculateStacksTxFees } from '@app/query/stacks/fees/fees.hooks';
import { useNextNonce } from '@app/query/stacks/nonce/account-nonces.hooks';
import { useCurrentAccountStxAddressState } from '@app/store/accounts/blockchain/stacks/stacks-account.hooks';
import { useCurrentNetworkState } from '@app/store/networks/networks.hooks';
import {
  useFtTokenTransferUnsignedTx,
  useGenerateFtTokenTransferUnsignedTx,
} from '@app/store/transactions/token-transfer.hooks';

import { useSendFormNavigate } from '../../hooks/use-send-form-navigate';
import { useSendFormRouteState } from '../../hooks/use-send-form-route-state';
import { createDefaultInitialFormValues } from '../../send-form.utils';
import { useStacksFtRouteState } from './use-stacks-ft-params';

export function useSip10SendForm() {
  const [contractId, setContractId] = useState('');
  const { isShowingHighFeeConfirmation, setIsShowingHighFeeConfirmation } = useDrawers();
  const { symbol } = useParams();
  const { data: nextNonce } = useNextNonce();
  const routeState = useSendFormRouteState();
  const generateTx = useGenerateFtTokenTransferUnsignedTx(contractId);
  const currentAccountStxAddress = useCurrentAccountStxAddressState();
  const currentNetwork = useCurrentNetworkState();
  const { whenWallet } = useWalletType();
  const ledgerNavigate = useLedgerNavigate();
  const sendFormNavigate = useSendFormNavigate();
  const assetBalance = useStacksFungibleTokenAssetBalance(contractId);
  const unsignedTx = useFtTokenTransferUnsignedTx(contractId);
  const { data: stacksFtFees } = useCalculateStacksTxFees(unsignedTx);

  const { contractId: routeContractId } = useStacksFtRouteState();

  const availableTokenBalance = assetBalance?.balance ?? createMoney(0, 'STX');
  const sendMaxBalance = useMemo(
    () => convertAmountToBaseUnit(availableTokenBalance),
    [availableTokenBalance]
  );

  useOnMount(() => {
    setContractId(routeContractId);
  });

  const initialValues: StacksSendFormValues = createDefaultInitialFormValues({
    fee: '',
    feeCurrency: 'STX',
    feeType: FeeTypes[FeeTypes.Unknown],
    memo: '',
    nonce: nextNonce?.nonce,
    recipientBnsName: '',
    symbol,
    ...routeState,
  });

  return {
    availableTokenBalance,
    initialValues,
    sendMaxBalance,
    stacksFtFees,
    symbol,

    validationSchema: yup.object({
      amount: stacksFungibleTokenAmountValidator(availableTokenBalance),
      recipient: stxRecipientValidator(currentAccountStxAddress, currentNetwork),
      memo: stxMemoValidator(FormErrorMessages.MemoExceedsLimit),
      nonce: nonceValidator,
    }),

    async previewTransaction(
      values: StacksSendFormValues,
      formikHelpers: FormikHelpers<StacksSendFormValues>
    ) {
      // Validate and check high fee warning first
      const formErrors = formikHelpers.validateForm();
      if (
        !isShowingHighFeeConfirmation &&
        isEmpty(formErrors) &&
        values.fee > HIGH_FEE_AMOUNT_STX
      ) {
        return setIsShowingHighFeeConfirmation(true);
      }

      const tx = await generateTx(values);
      if (!tx) return logger.error('Attempted to generate unsigned tx, but tx is undefined');

      whenWallet({
        software: () =>
          sendFormNavigate.toConfirmAndSignStacksSip10Transaction({
            decimals: assetBalance?.balance.decimals,
            name: assetBalance?.asset.name,
            tx,
          }),
        ledger: () => ledgerNavigate.toConnectAndSignTransactionStep(tx),
      })();
    },
  };
}
