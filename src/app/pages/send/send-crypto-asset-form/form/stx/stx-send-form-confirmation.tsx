import { useLocation } from 'react-router-dom';

import { Stack } from '@stacks/ui';
import { SendCryptoAssetSelectors } from '@tests/selectors/send.selectors';
import get from 'lodash.get';

import { useRouteHeader } from '@app/common/hooks/use-route-header';
import { FormAddressDisplayer } from '@app/components/address-displayer/form-address-displayer';
import {
  InfoCard,
  InfoCardAssetValue,
  InfoCardRow,
  InfoCardSeparator,
} from '@app/components/info-card/info-card';
import { InfoLabel } from '@app/components/info-label';
import { ModalHeader } from '@app/components/modal-header';
import { PrimaryButton } from '@app/components/primary-button';

import { useStacksBroadcastTransaction } from '../../family/stacks/hooks/use-stacks-broadcast-transaction';

export function StxSendFormConfirmation() {
  const location = useLocation();
  const tx = get(location.state, 'tx');
  const {
    stacksDeserializedTransaction,
    stacksBroadcastTransaction,
    formReviewTxSummary,
    isBroadcasting,
  } = useStacksBroadcastTransaction(tx);

  const {
    txValue,
    txFiatValue,
    recipient,
    fee,
    totalSpend,
    sendingValue,
    arrivesIn,
    nonce,
    memoDisplayText,
    symbol,
  } = formReviewTxSummary(stacksDeserializedTransaction);

  useRouteHeader(<ModalHeader hideActions defaultClose defaultGoBack title="Review" />);

  return (
    <InfoCard
      pt="extra-loose"
      pb="extra-loose"
      px="extra-loose"
      data-testid={SendCryptoAssetSelectors.ConfirmationDetails}
    >
      <InfoCardAssetValue
        value={Number(txValue)}
        fiatValue={txFiatValue}
        symbol={symbol}
        data-testid={SendCryptoAssetSelectors.ConfirmationDetailsAssetValue}
      />

      <Stack width="100%">
        <InfoCardRow
          title="To"
          value={<FormAddressDisplayer address={recipient} />}
          data-testid={SendCryptoAssetSelectors.ConfirmationDetailsRecipient}
        />
        <InfoCardSeparator />
        <InfoCardRow title="Total spend" value={totalSpend} />
        <InfoCardRow title="Sending" value={sendingValue} />
        <InfoCardRow
          title="Fee"
          value={fee}
          data-testid={SendCryptoAssetSelectors.ConfirmationDetailsFee}
        />
        <InfoCardRow
          title="Memo"
          value={memoDisplayText}
          data-testid={SendCryptoAssetSelectors.ConfirmationDetailsMemo}
        />
        <InfoCardRow title="Nonce" value={nonce} />
        <InfoCardRow title="Estimated confirmation time" value={arrivesIn} />
      </Stack>

      <InfoLabel my="extra-loose" title="Sending to an exchange?">
        {`Make sure you include the memo so the exchange can credit the ${symbol} to your account`}
      </InfoLabel>

      <PrimaryButton
        data-testid={SendCryptoAssetSelectors.ConfirmSendTxBtn}
        width="100%"
        isLoading={isBroadcasting}
        onClick={() => stacksBroadcastTransaction(stacksDeserializedTransaction)}
      >
        Confirm and send transaction
      </PrimaryButton>
    </InfoCard>
  );
}
