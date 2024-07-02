import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import * as yup from 'yup';

import { bitcoinNetworkModeToCoreNetworkMode } from '@leather.io/bitcoin';
import { useNumberOfInscriptionsOnUtxo } from '@leather.io/query';
import { isError } from '@leather.io/utils';

import { FormErrorMessages } from '@shared/error-messages';
import { logger } from '@shared/logger';
import { OrdinalSendFormValues } from '@shared/models/form.model';
import { RouteUrls } from '@shared/route-urls';
import { analytics } from '@shared/utils/analytics';

import { formFeeRowValue } from '@app/common/send/utils';
import { InsufficientFundsError } from '@app/common/transactions/bitcoin/coinselect/local-coin-selection';
import {
  btcAddressNetworkValidator,
  btcAddressValidator,
} from '@app/common/validation/forms/address-validators';
import { complianceValidator } from '@app/common/validation/forms/compliance-validators';
import { useSignBitcoinTx } from '@app/store/accounts/blockchain/bitcoin/bitcoin.hooks';
import { useCurrentAccountNativeSegwitIndexZeroSigner } from '@app/store/accounts/blockchain/bitcoin/native-segwit-account.hooks';
import { useCurrentTaprootAccount } from '@app/store/accounts/blockchain/bitcoin/taproot-account.hooks';
import { useCurrentNetwork } from '@app/store/networks/networks.selectors';

import { useSendInscriptionState } from '../components/send-inscription-container';
import { recipientFieldName } from '../send-inscription-form';
import { useGenerateUnsignedOrdinalTx } from './use-generate-ordinal-tx';

export function useSendInscriptionForm() {
  const [currentError, setShowError] = useState<null | string>(null);
  const [isCheckingFees, setIsCheckingFees] = useState(false);

  const navigate = useNavigate();
  const sign = useSignBitcoinTx();
  const { inscription, utxo } = useSendInscriptionState();
  const currentNetwork = useCurrentNetwork();

  const account = useCurrentTaprootAccount();
  const nativeSegwitSigner = useCurrentAccountNativeSegwitIndexZeroSigner();

  const getNumberOfInscriptionOnUtxo = useNumberOfInscriptionsOnUtxo({
    taprootKeychain: account?.keychain,
    nativeSegwitAddress: nativeSegwitSigner.address,
  });
  const { coverFeeFromAdditionalUtxos } = useGenerateUnsignedOrdinalTx(utxo);

  return {
    currentError,
    isCheckingFees,
    async chooseTransactionFee(values: OrdinalSendFormValues) {
      setIsCheckingFees(true);

      try {
        // Check tx with lowest fee for errors before routing and
        // generating the final transaction with the chosen fee to send
        const resp = coverFeeFromAdditionalUtxos(values);

        if (!resp) {
          setShowError(
            'Insufficient funds to cover fee. Deposit some BTC to your Native Segwit address.'
          );
          return;
        }

        if (Number(inscription.offset) !== 0) {
          setShowError('Sending inscriptions at non-zero offsets is unsupported');
          return;
        }

        const numInscriptionsOnUtxo = getNumberOfInscriptionOnUtxo(utxo.txid, utxo.vout);
        if (numInscriptionsOnUtxo > 1) {
          setShowError('Sending inscription from utxo with multiple inscriptions is unsupported');
          return;
        }
      } catch (error) {
        void analytics.track('ordinals_dot_com_unavailable', { error });

        if (error instanceof InsufficientFundsError) {
          setShowError(
            'Insufficient funds to cover fee. Deposit some BTC to your Native Segwit address.'
          );
          return;
        }

        let message = 'Unable to establish if utxo has multiple inscriptions';
        if (isError(error)) {
          message = error.message;
        }
        setShowError(message);
      } finally {
        setIsCheckingFees(false);
      }

      navigate(
        `/${RouteUrls.SendOrdinalInscription}/${RouteUrls.SendOrdinalInscriptionChooseFee}`,
        {
          state: {
            inscription,
            recipient: values.recipient,
            utxo,
            backgroundLocation: { pathname: RouteUrls.Home },
          },
        }
      );
    },

    async reviewTransaction(
      feeValue: number,
      time: string,
      values: OrdinalSendFormValues,
      isCustomFee?: boolean
    ) {
      // Generate the final tx with the chosen fee to send
      const resp = coverFeeFromAdditionalUtxos(values);

      if (!resp) {
        logger.error('Failed to generate transaction for send');
        return;
      }

      const signedTx = await sign(resp.psbt, resp.signingConfig);

      if (!signedTx) {
        logger.error('No signed transaction returned');
        return;
      }

      signedTx.finalize();

      logger.debug('Pre-finalized inscription PSBT', signedTx.hex);

      const feeRowValue = formFeeRowValue(values.feeRate, isCustomFee);
      navigate(`/${RouteUrls.SendOrdinalInscription}/${RouteUrls.SendOrdinalInscriptionReview}`, {
        state: {
          fee: feeValue,
          inscription,
          utxo,
          recipient: values.recipient,
          time,
          feeRowValue,
          signedTx: signedTx.extract(),
          backgroundLocation: { pathname: RouteUrls.Home },
        },
      });
    },

    validationSchema: yup.object({
      [recipientFieldName]: yup
        .string()
        .required(FormErrorMessages.AddressRequired)
        .concat(btcAddressValidator())
        .concat(
          complianceValidator(
            btcAddressValidator(),
            bitcoinNetworkModeToCoreNetworkMode(currentNetwork.chain.bitcoin.bitcoinNetwork)
          )
        )
        .concat(btcAddressNetworkValidator(currentNetwork.chain.bitcoin.bitcoinNetwork)),
    }),
  };
}
