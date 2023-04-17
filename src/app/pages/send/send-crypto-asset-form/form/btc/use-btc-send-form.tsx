import { useRef } from 'react';

import { FormikHelpers, FormikProps } from 'formik';
import * as yup from 'yup';

import { logger } from '@shared/logger';
import { BitcoinSendFormValues } from '@shared/models/form.model';

import { formatPrecisionError } from '@app/common/error-formatters';
import { useWalletType } from '@app/common/use-wallet-type';
import {
  btcAddressNetworkValidator,
  btcAddressValidator,
  notCurrentAddressValidator,
} from '@app/common/validation/forms/address-validators';
import {
  btcInsufficientBalanceValidator,
  btcMinimumSpendValidator,
} from '@app/common/validation/forms/amount-validators';
import { btcAmountPrecisionValidator } from '@app/common/validation/forms/currency-validators';
import { useUpdatePersistedSendFormValues } from '@app/features/popup-send-form-restoration/use-update-persisted-send-form-values';
import { useNativeSegwitBalance } from '@app/query/bitcoin/balance/bitcoin-balances.query';
import { useCurrentBtcNativeSegwitAccountAddressIndexZero } from '@app/store/accounts/blockchain/bitcoin/native-segwit-account.hooks';
import { useCurrentNetwork } from '@app/store/networks/networks.selectors';

import { useCalculateMaxBitcoinSpend } from '../../family/bitcoin/hooks/use-calculate-max-spend';
import { useSendFormNavigate } from '../../hooks/use-send-form-navigate';

export function useBtcSendForm() {
  const formRef = useRef<FormikProps<BitcoinSendFormValues>>(null);
  const currentNetwork = useCurrentNetwork();
  const currentAccountBtcAddress = useCurrentBtcNativeSegwitAccountAddressIndexZero();
  const btcCryptoCurrencyAssetBalance = useNativeSegwitBalance(currentAccountBtcAddress);
  const { whenWallet } = useWalletType();
  const sendFormNavigate = useSendFormNavigate();
  const calcMaxSpend = useCalculateMaxBitcoinSpend();
  const { onFormStateChange } = useUpdatePersistedSendFormValues();

  return {
    calcMaxSpend,
    currentNetwork,
    formRef,
    onFormStateChange,

    validationSchema: yup.object({
      amount: yup
        .number()
        .concat(
          btcAmountPrecisionValidator(formatPrecisionError(btcCryptoCurrencyAssetBalance.balance))
        )
        .concat(
          btcInsufficientBalanceValidator({
            // TODO: investigate yup features for cross-field validation
            // to prevent need to access form via ref
            recipient: formRef.current?.values.recipient ?? '',
            calcMaxSpend,
          })
        )
        .concat(btcMinimumSpendValidator()),
      recipient: yup
        .string()
        .concat(btcAddressValidator())
        .concat(btcAddressNetworkValidator(currentNetwork.chain.bitcoin.network))
        .concat(notCurrentAddressValidator(currentAccountBtcAddress || '')),
    }),

    async chooseTransactionFee(
      values: BitcoinSendFormValues,
      formikHelpers: FormikHelpers<BitcoinSendFormValues>
    ) {
      logger.debug('btc form values', values);
      // Validate and check high fee warning first
      await formikHelpers.validateForm();

      whenWallet({
        software: () => sendFormNavigate.toChooseTransactionFee(values),
        ledger: () => {},
      })();
    },
  };
}
