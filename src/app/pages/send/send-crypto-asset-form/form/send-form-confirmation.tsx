import { SendCryptoAssetSelectors } from '@tests/selectors/send.selectors';
import { Stack } from 'leather-styles/jsx';

import { Button, Callout } from '@leather-wallet/ui';

import { FormAddressDisplayer } from '@app/components/address-displayer/form-address-displayer';
import {
  InfoCardAssetValue,
  InfoCardRow,
  InfoCardSeparator,
} from '@app/components/info-card/info-card';
import { Footer } from '@app/ui/components/containers/footers/footer';
import { Card } from '@app/ui/layout/card/card';
import { CardContent } from '@app/ui/layout/card/card-content';

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
  feeWarningTooltip?: React.ReactNode;
  onBroadcastTransaction(): void;
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
  feeWarningTooltip,
}: SendFormConfirmationProps) {
  return (
    <Card
      footer={
        <Footer variant="card">
          <Button
            aria-busy={isLoading}
            data-testid={SendCryptoAssetSelectors.ConfirmSendTxBtn}
            onClick={onBroadcastTransaction}
            width="100%"
          >
            Confirm and send transaction
          </Button>
        </Footer>
      }
    >
      <CardContent dataTestId={SendCryptoAssetSelectors.ConfirmationDetails} p="space.00">
        <InfoCardAssetValue
          data-testid={SendCryptoAssetSelectors.ConfirmationDetailsAssetValue}
          fiatSymbol={txFiatValueSymbol}
          fiatValue={txFiatValue}
          mb="space.05"
          mt={['unset', 'space.05']}
          px="space.05"
          symbol={symbol}
          value={Number(txValue)}
        />

        <Callout variant="info" title="Sending to an exchange?" px="space.03" mb="space.05">
          {`Make sure you include the memo so the exchange can credit the ${symbol} to your account`}
        </Callout>

        <Stack pb="space.06" px="space.06" width="100%">
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
            titleAdditionalElement={feeWarningTooltip}
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
      </CardContent>
    </Card>
  );
}
