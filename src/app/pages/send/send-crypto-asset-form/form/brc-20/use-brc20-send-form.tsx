import { useRef } from 'react';
import { useNavigate } from 'react-router-dom';

import BigNumber from 'bignumber.js';
import { FormikHelpers, FormikProps } from 'formik';
import * as yup from 'yup';

import { logger } from '@shared/logger';
import { createMoney } from '@shared/models/money.model';
import { RouteUrls } from '@shared/route-urls';
import { noop } from '@shared/utils';

import { useOnMount } from '@app/common/hooks/use-on-mount';
import { unitToFractionalUnit } from '@app/common/money/unit-conversion';
import { useWalletType } from '@app/common/use-wallet-type';
import {
  btcAddressNetworkValidator,
  btcAddressValidator,
} from '@app/common/validation/forms/address-validators';
import { tokenAmountValidator } from '@app/common/validation/forms/amount-validators';
import { currencyAmountValidator } from '@app/common/validation/forms/currency-validators';
import { useUpdatePersistedSendFormValues } from '@app/features/popup-send-form-restoration/use-update-persisted-send-form-values';
import { useCurrentNativeSegwitAccountSpendableUtxos } from '@app/query/bitcoin/address/utxos-by-address.hooks';
import { useCurrentAccountNativeSegwitIndexZeroSigner } from '@app/store/accounts/blockchain/bitcoin/native-segwit-account.hooks';
import { useCurrentNetwork } from '@app/store/networks/networks.selectors';

import { createDefaultInitialFormValues } from '../../send-form.utils';

interface Brc20SendFormValues {
  recipient: string;
  amount: string;
  symbol: string;
}

interface UseBrc20SendFormArgs {
  balance: string;
  tick: string;
  decimals: number;
}

export function useBrc20SendForm({ balance, tick, decimals }: UseBrc20SendFormArgs) {
  const formRef = useRef<FormikProps<Brc20SendFormValues>>(null);
  const { whenWallet } = useWalletType();
  const navigate = useNavigate();
  const currentNetwork = useCurrentNetwork();
  const nativeSegwitSigner = useCurrentAccountNativeSegwitIndexZeroSigner();
  const { data: utxos = [], refetch } = useCurrentNativeSegwitAccountSpendableUtxos();

  // Forcing a refetch to ensure UTXOs are fresh
  useOnMount(() => refetch());

  // TODO: change recipient to that one user iputs
  const initialValues = createDefaultInitialFormValues({
    recipient: nativeSegwitSigner.address,
    amount: '',
    symbol: tick,
  });

  const validationSchema = yup.object({
    amount: yup
      .number()
      .concat(currencyAmountValidator())
      .concat(tokenAmountValidator(createMoney(new BigNumber(balance), tick, 0))),
    recipient: yup
      .string()
      .concat(btcAddressValidator())
      .concat(btcAddressNetworkValidator(currentNetwork.chain.bitcoin.network)),
    // .concat(notCurrentAddressValidator(currentAccountBtcAddress || '')),
  });
  const { onFormStateChange } = useUpdatePersistedSendFormValues();

  async function chooseTransactionFee(
    values: Brc20SendFormValues,
    formikHelpers: FormikHelpers<Brc20SendFormValues>
  ) {
    logger.debug('btc form values', values);
    // Validate and check high fee warning first
    await formikHelpers.validateForm();
    whenWallet({
      software: () =>
        navigate(RouteUrls.SendBrc20ChooseFee.replace(':ticker', tick), {
          state: { ...values, tick, utxos, hasHeaderTitle: true },
        }),
      ledger: noop,
    })();
  }

  return {
    initialValues,
    chooseTransactionFee,
    validationSchema,
    formRef,
    onFormStateChange,
    moneyBalance: createMoney(
      unitToFractionalUnit(decimals)(new BigNumber(balance)),
      tick,
      decimals
    ),
  };
}
