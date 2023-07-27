import { useRef, useState } from 'react';

import { FormikHelpers, FormikProps } from 'formik';
import { DefaultWalletPolicy } from 'ledger-bitcoin';
import * as yup from 'yup';

import {
  extractAccountIndexFromPath,
  getBitcoinCoinTypeIndexByNetwork,
} from '@shared/crypto/bitcoin/bitcoin.utils';
import { logger } from '@shared/logger';
import { BitcoinSendFormValues } from '@shared/models/form.model';
import { noop } from '@shared/utils';

import { formatPrecisionError } from '@app/common/error-formatters';
import { useOnMount } from '@app/common/hooks/use-on-mount';
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
import {
  btcAmountPrecisionValidator,
  currencyAmountValidator,
} from '@app/common/validation/forms/currency-validators';
import { connectLedgerBitcoinApp } from '@app/features/ledger/utils/bitcoin-ledger-utils';
import { useUpdatePersistedSendFormValues } from '@app/features/popup-send-form-restoration/use-update-persisted-send-form-values';
import { useSpendableCurrentNativeSegwitAccountUtxos } from '@app/query/bitcoin/address/utxos-by-address.hooks';
import { useNativeSegwitBalance } from '@app/query/bitcoin/balance/bitcoin-balances.query';
import { useCurrentAccountNativeSegwitIndexZeroSigner } from '@app/store/accounts/blockchain/bitcoin/native-segwit-account.hooks';
import { useCurrentNetwork } from '@app/store/networks/networks.selectors';

import { useCalculateMaxBitcoinSpend } from '../../family/bitcoin/hooks/use-calculate-max-spend';
import { useSendFormNavigate } from '../../hooks/use-send-form-navigate';

export function useBtcSendForm() {
  const [isSendingMax, setIsSendingMax] = useState(false);
  const formRef = useRef<FormikProps<BitcoinSendFormValues>>(null);
  const currentNetwork = useCurrentNetwork();
  const nativeSegwitSigner = useCurrentAccountNativeSegwitIndexZeroSigner();
  const { data: utxos = [], refetch } = useSpendableCurrentNativeSegwitAccountUtxos();
  const btcCryptoCurrencyAssetBalance = useNativeSegwitBalance(nativeSegwitSigner.address);
  const { whenWallet } = useWalletType();
  const sendFormNavigate = useSendFormNavigate();
  const calcMaxSpend = useCalculateMaxBitcoinSpend();
  const { onFormStateChange } = useUpdatePersistedSendFormValues();

  // Forcing a refetch to ensure UTXOs are fresh
  useOnMount(() => refetch());

  return {
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
        .concat(
          btcAmountPrecisionValidator(formatPrecisionError(btcCryptoCurrencyAssetBalance.balance))
        )
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
        .concat(btcAddressNetworkValidator(currentNetwork.chain.bitcoin.network))
        .concat(notCurrentAddressValidator(nativeSegwitSigner.address || ''))
        .required('Enter a bitcoin address'),
    }),

    async chooseTransactionFee(
      values: BitcoinSendFormValues,
      formikHelpers: FormikHelpers<BitcoinSendFormValues>
    ) {
      // Validate and check high fee warning first
      logger.debug('btc form values', values);

      await formikHelpers.validateForm();
      sendFormNavigate.toChooseTransactionFee(isSendingMax, utxos, values);
    },
  };
}

// console.log('sending bitcoin amount with ledger', values);
// const app = await connectLedgerBitcoinApp();

// const masterFingerPrint = await app.getMasterFingerprint();
// const extendedPublicKey = await app.getExtendedPubkey(
//   `m/84'/${getBitcoinCoinTypeIndexByNetwork(
//     currentNetwork.chain.bitcoin.network
//   )}'/${extractAccountIndexFromPath(nativeSegwitSigner.derivationPath)}'`
// );

// const accountPolicy = new DefaultWalletPolicy(
//   'wpkh(@0/**)',
//   `[${masterFingerPrint}/84'/${getBitcoinCoinTypeIndexByNetwork(
//     currentNetwork.chain.bitcoin.network
//   )}'/0']${extendedPublicKey}`
// );

// console.log('account policy', accountPolicy);

// console.log(app);
// // app.signPsbt();
// await app.transport.close();
// console.log('transport closed');
