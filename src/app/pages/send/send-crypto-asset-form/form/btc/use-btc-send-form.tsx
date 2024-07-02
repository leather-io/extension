import { useRef, useState } from 'react';

import { FormikHelpers, FormikProps } from 'formik';
import * as yup from 'yup';

import { bitcoinNetworkModeToCoreNetworkMode } from '@leather.io/bitcoin';

import { BitcoinSendFormValues } from '@shared/models/form.model';

import { formatPrecisionError } from '@app/common/error-formatters';
import { useOnMount } from '@app/common/hooks/use-on-mount';
import {
  btcAddressNetworkValidator,
  btcAddressValidator,
  notCurrentAddressValidator,
} from '@app/common/validation/forms/address-validators';
import {
  btcInsufficientBalanceValidator,
  btcMinimumSpendValidator,
} from '@app/common/validation/forms/amount-validators';
import { complianceValidator } from '@app/common/validation/forms/compliance-validators';
import {
  btcAmountPrecisionValidator,
  currencyAmountValidator,
} from '@app/common/validation/forms/currency-validators';
import { useUpdatePersistedSendFormValues } from '@app/features/popup-send-form-restoration/use-update-persisted-send-form-values';
import { useCurrentNativeSegwitUtxos } from '@app/query/bitcoin/address/utxos-by-address.hooks';
import { useCurrentBtcCryptoAssetBalanceNativeSegwit } from '@app/query/bitcoin/balance/btc-balance-native-segwit.hooks';
import { useCurrentAccountNativeSegwitIndexZeroSigner } from '@app/store/accounts/blockchain/bitcoin/native-segwit-account.hooks';
import { useCurrentNetwork } from '@app/store/networks/networks.selectors';

import { useCalculateMaxBitcoinSpend } from '../../family/bitcoin/hooks/use-calculate-max-spend';
import { useSendFormNavigate } from '../../hooks/use-send-form-navigate';

export function useBtcSendForm() {
  const [isSendingMax, setIsSendingMax] = useState(false);
  const formRef = useRef<FormikProps<BitcoinSendFormValues>>(null);
  const currentNetwork = useCurrentNetwork();
  const nativeSegwitSigner = useCurrentAccountNativeSegwitIndexZeroSigner();
  const { data: utxos = [], refetch } = useCurrentNativeSegwitUtxos();
  const { balance } = useCurrentBtcCryptoAssetBalanceNativeSegwit();
  const sendFormNavigate = useSendFormNavigate();
  const calcMaxSpend = useCalculateMaxBitcoinSpend();
  const { onFormStateChange } = useUpdatePersistedSendFormValues();

  // Forcing a refetch to ensure UTXOs are fresh
  useOnMount(() => refetch());

  return {
    balance,
    calcMaxSpend,
    currentNetwork,
    formRef,
    isSendingMax,
    onFormStateChange,
    onSetIsSendingMax(value: boolean) {
      setIsSendingMax(value);
    },
    utxos,
    validationSchema: yup.object({
      amount: yup
        .number()
        .concat(btcMinimumSpendValidator())
        .concat(btcAmountPrecisionValidator(formatPrecisionError(balance.availableBalance)))
        .concat(currencyAmountValidator())
        .concat(
          btcInsufficientBalanceValidator({
            calcMaxSpend,
            // TODO: investigate yup features for cross-field validation
            // to prevent need to access form via ref
            recipient: formRef.current?.values.recipient ?? '',
            utxos,
          })
        ),
      recipient: yup
        .string()
        .concat(btcAddressValidator())
        .concat(btcAddressNetworkValidator(currentNetwork.chain.bitcoin.bitcoinNetwork))
        .concat(notCurrentAddressValidator(nativeSegwitSigner.address || ''))
        .concat(
          complianceValidator(
            btcAddressValidator(),
            bitcoinNetworkModeToCoreNetworkMode(currentNetwork.chain.bitcoin.bitcoinNetwork)
          )
        )
        .required('Enter a bitcoin address'),
    }),

    async chooseTransactionFee(
      values: BitcoinSendFormValues,
      formikHelpers: FormikHelpers<BitcoinSendFormValues>
    ) {
      // Validate and check high fee warning firsts
      await formikHelpers.validateForm();
      sendFormNavigate.toChooseTransactionFee(isSendingMax, utxos, values);
    },
  };
}
