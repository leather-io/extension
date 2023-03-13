import { useLocation, useNavigate } from 'react-router-dom';

import { Stack } from '@stacks/ui';
import { SendCryptoAssetSelectors } from '@tests/selectors/send.selectors';
import get from 'lodash.get';

import { useRouteHeader } from '@app/common/hooks/use-route-header';
import { FormAddressDisplayer } from '@app/components/address-displayer/form-address-displayer';
import { Header } from '@app/components/header';
import {
  InfoCard,
  InfoCardAssetValue,
  InfoCardRow,
  InfoCardSeparator,
} from '@app/components/info-card/info-card';
import { InfoLabel } from '@app/components/info-label';
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

  const navigate = useNavigate();

  useRouteHeader(
    <Header hideActions onClose={() => navigate('..', { relative: 'path' })} title="Review" />
  );

  return (
    <InfoCard pt="extra-loose" pb="extra-loose" px="extra-loose">
      <InfoCardAssetValue value={Number(txValue)} fiatValue={txFiatValue} symbol={symbol} />

      <Stack width="100%">
        <InfoCardRow title="To" value={<FormAddressDisplayer address={recipient} />} />
        <InfoCardSeparator />
        <InfoCardRow title="Total spend" value={totalSpend} />
        <InfoCardRow title="Sending" value={sendingValue} />
        <InfoCardRow title="Fee" value={fee} />
        <InfoCardRow title="Memo" value={memoDisplayText} />
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
