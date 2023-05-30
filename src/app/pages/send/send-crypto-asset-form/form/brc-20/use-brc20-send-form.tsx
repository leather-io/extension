import { useRef } from 'react';
import { useNavigate } from 'react-router-dom';

import BigNumber from 'bignumber.js';
import { FormikHelpers, FormikProps } from 'formik';
import * as yup from 'yup';

import { logger } from '@shared/logger';
import { createMoney } from '@shared/models/money.model';
import { RouteUrls } from '@shared/route-urls';
import { noop } from '@shared/utils';

import { useWalletType } from '@app/common/use-wallet-type';
import {
  btcAddressNetworkValidator,
  btcAddressValidator,
  notCurrentAddressValidator,
} from '@app/common/validation/forms/address-validators';
import { useUpdatePersistedSendFormValues } from '@app/features/popup-send-form-restoration/use-update-persisted-send-form-values';
import { useCurrentAccountNativeSegwitAddressIndexZero } from '@app/store/accounts/blockchain/bitcoin/native-segwit-account.hooks';
import { useCurrentNetwork } from '@app/store/networks/networks.selectors';

import { createDefaultInitialFormValues } from '../../send-form.utils';

interface Brc20SendFormValues {
  recipient: string;
  amount: string;
  symbol: string;
}

export function useBrc20SendForm({ balance, tick }: { balance: string; tick: string }) {
  const formRef = useRef<FormikProps<Brc20SendFormValues>>(null);
  const { whenWallet } = useWalletType();
  const navigate = useNavigate();
  const currentNetwork = useCurrentNetwork();
  const currentAccountBtcAddress = useCurrentAccountNativeSegwitAddressIndexZero();

  const initialValues = createDefaultInitialFormValues({
    recipient: '',
    amount: '',
    symbol: tick,
  });

  const validationSchema = yup.object({
    recipient: yup
      .string()
      .concat(btcAddressValidator())
      .concat(btcAddressNetworkValidator(currentNetwork.chain.bitcoin.network))
      .concat(notCurrentAddressValidator(currentAccountBtcAddress || '')),
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
          state: { ...values, tick, hasHeaderTitle: true },
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
    moneyBalance: createMoney(new BigNumber(balance), tick, 0),
  };
}
