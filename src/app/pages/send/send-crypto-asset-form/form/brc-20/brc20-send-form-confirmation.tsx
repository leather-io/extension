import { useLocation, useNavigate } from 'react-router-dom';

import { Stack } from '@stacks/ui';
import { SendCryptoAssetSelectors } from '@tests/selectors/send.selectors';
import get from 'lodash.get';

import { createMoney } from '@shared/models/money.model';
import { RouteUrls } from '@shared/route-urls';

import { useRouteHeader } from '@app/common/hooks/use-route-header';
import { formatMoneyPadded } from '@app/common/money/format-money';
import { FormAddressDisplayer } from '@app/components/address-displayer/form-address-displayer';
import {
  InfoCard,
  InfoCardAssetValue,
  InfoCardFooter,
  InfoCardRow,
  InfoCardSeparator,
} from '@app/components/info-card/info-card';
import { ModalHeader } from '@app/components/modal-header';
import { PrimaryButton } from '@app/components/primary-button';

function useBrc20SendFormConfirmationState() {
  const location = useLocation();
  return {
    fee: get(location.state, 'fee') as string,
    serviceFee: get(location.state, 'serviceFee') as string,
    recipient: get(location.state, 'recipient') as string,
    tick: get(location.state, 'tick') as string,
    amount: get(location.state, 'amount') as string,
  };
}

export function Brc20SendFormConfirmation() {
  const navigate = useNavigate();
  const { amount, recipient, fee, tick, serviceFee } = useBrc20SendFormConfirmationState();

  const summaryFee = formatMoneyPadded(createMoney(Number(fee), 'BTC'));

  async function initiateTransaction() {
    navigate(RouteUrls.SentBrc20Summary.replace(':ticker', tick), {
      state: {
        fee: summaryFee,
        recipient,
        tick,
        amount,
        hasHeaderTitle: true,
      },
    });
  }

  useRouteHeader(<ModalHeader hideActions defaultClose defaultGoBack title="Review" />);

  return (
    <InfoCard data-testid={SendCryptoAssetSelectors.ConfirmationDetails}>
      <InfoCardAssetValue
        value={Number(amount)}
        symbol={tick}
        data-testid={SendCryptoAssetSelectors.ConfirmationDetailsAssetValue}
        mt="loose"
        mb="extra-loose"
        px="loose"
      />

      <Stack width="100%" px="extra-loose" pb="extra-loose">
        <InfoCardRow
          title="To"
          value={<FormAddressDisplayer address={recipient} />}
          data-testid={SendCryptoAssetSelectors.ConfirmationDetailsRecipient}
        />
        <InfoCardSeparator />
        <InfoCardRow title="Sending" value={amount} />
        <InfoCardRow title="Inscription service fee" value={serviceFee} />
        <InfoCardRow
          title="Fee"
          value={summaryFee}
          data-testid={SendCryptoAssetSelectors.ConfirmationDetailsFee}
        />
      </Stack>

      <InfoCardFooter>
        <PrimaryButton isLoading={false} width="100%" onClick={initiateTransaction}>
          Confirm and send transaction
        </PrimaryButton>
      </InfoCardFooter>
    </InfoCard>
  );
}
