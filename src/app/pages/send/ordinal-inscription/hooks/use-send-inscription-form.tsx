import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import * as yup from 'yup';

import { bitcoinNetworkModeToCoreNetworkMode } from '@leather.io/bitcoin';
import { isError } from '@leather.io/utils';

import { FormErrorMessages } from '@shared/error-messages';
import { btcAddressNetworkValidator, btcAddressValidator } from '@shared/forms/address-validators';
import { logger } from '@shared/logger';
import { OrdinalSendFormValues } from '@shared/models/form.model';
import { RouteUrls } from '@shared/route-urls';
import { analytics } from '@shared/utils/analytics';

import { formFeeRowValue } from '@app/common/send/utils';
import { InsufficientFundsError } from '@app/common/transactions/bitcoin/coinselect/local-coin-selection';
import { complianceValidator } from '@app/common/validation/forms/compliance-validators';
import { useNumberOfInscriptionsOnUtxo } from '@app/query/bitcoin/ordinals/inscriptions/inscriptions.query';
import { useSignBitcoinTx } from '@app/store/accounts/blockchain/bitcoin/bitcoin.hooks';
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

  const getNumberOfInscriptionOnUtxo = useNumberOfInscriptionsOnUtxo();

  const { coverFeeFromAdditionalUtxos } = useGenerateUnsignedOrdinalTx(utxo);

  return {
    currentError,
    isCheckingFees,
    async chooseTransactionFee(values: OrdinalSendFormValues) {
      setIsCheckingFees(true);

      try {
        if (Number(inscription.offset) !== 0) {
          setShowError(FormErrorMessages.NonZeroOffsetInscription);
          return;
        }

        const numInscriptionsOnUtxo = getNumberOfInscriptionOnUtxo(utxo.txid, utxo.vout);

        if (numInscriptionsOnUtxo > 1) {
          setShowError(FormErrorMessages.UtxoWithMultipleInscriptions);
          return;
        }

        // Check tx with lowest fee for errors before routing and
        // generating the final transaction with the chosen fee to send
        const resp = coverFeeFromAdditionalUtxos(values);

        if (!resp) {
          setShowError(FormErrorMessages.InsufficientFundsToCoverFee);
          return;
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
      } catch (error) {
        void analytics.track('ordinals_dot_com_unavailable', { error });

        if (error instanceof InsufficientFundsError) {
          setShowError(FormErrorMessages.InsufficientFundsToCoverFee);
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
            bitcoinNetworkModeToCoreNetworkMode(currentNetwork.chain.bitcoin.mode)
          )
        )
        .concat(btcAddressNetworkValidator(currentNetwork.chain.bitcoin.mode)),
    }),
  };
}
