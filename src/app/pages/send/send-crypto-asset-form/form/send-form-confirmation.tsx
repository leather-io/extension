import { Stack } from '@stacks/ui';
import { SendCryptoAssetSelectors } from '@tests/selectors/send.selectors';

import { FormAddressDisplayer } from '@app/components/address-displayer/form-address-displayer';
import {
  InfoCard,
  InfoCardAssetValue,
  InfoCardRow,
  InfoCardSeparator,
} from '@app/components/info-card/info-card';
import { InfoLabel } from '@app/components/info-label';
import { PrimaryButton } from '@app/components/primary-button';

interface SendFormConfirmationProps {
  recipient: string;
  fee?: string;
  totalSpend: string;
  arrivesIn: string;
  symbol: string;
  txValue: string | number;
  sendingValue: string;
  txFiatValue?: string;
  txFiatValueSymbol?: string;
  nonce: string;
  memoDisplayText: string;
  isLoading: boolean;
  onBroadcastTransaction: () => void;
}

export function SendFormConfirmation({
  txValue,
  txFiatValue,
  txFiatValueSymbol,
  recipient,
  fee,
  totalSpend,
  sendingValue,
  arrivesIn,
  isLoading,
  onBroadcastTransaction,
  nonce,
  memoDisplayText,
  symbol,
}: SendFormConfirmationProps) {
  return (
    <InfoCard padding="extra-loose" data-testid={SendCryptoAssetSelectors.ConfirmationDetails}>
      <InfoCardAssetValue
        value={Number(txValue)}
        fiatValue={txFiatValue}
        fiatSymbol={txFiatValueSymbol}
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
        isLoading={isLoading}
        onClick={onBroadcastTransaction}
      >
        Confirm and send transaction
      </PrimaryButton>
    </InfoCard>
  );
}
