import { FiCheck } from 'react-icons/fi';
import { useLocation } from 'react-router-dom';

import { Stack } from '@stacks/ui';
import get from 'lodash.get';

import { useRouteHeader } from '@app/common/hooks/use-route-header';
import { FormAddressDisplayer } from '@app/components/address-displayer/form-address-displayer';
import {
  InfoCard,
  InfoCardAssetValue,
  InfoCardRow,
  InfoCardSeparator,
} from '@app/components/info-card/info-card';
import { ModalHeader } from '@app/components/modal-header';

function useBrc20SentSummaryState() {
  const location = useLocation();
  return {
    fee: get(location.state, 'fee') as string,
    recipient: get(location.state, 'recipient') as string,
    tick: get(location.state, 'tick') as string,
    amount: get(location.state, 'amount') as string,
  };
}

export function Brc20SentSummary() {
  const { fee, recipient, tick, amount } = useBrc20SentSummaryState();

  useRouteHeader(<ModalHeader hideActions defaultClose title="Sent" />);

  return (
    <InfoCard>
      <InfoCardAssetValue
        value={Number(amount)}
        symbol={tick}
        icon={FiCheck}
        my="loose"
        px="loose"
      />

      <Stack width="100%" px="extra-loose" pb="extra-loose">
        <InfoCardRow title="To" value={<FormAddressDisplayer address={recipient} />} />
        <InfoCardSeparator />

        <InfoCardRow title="Sending" value={amount} />
        <InfoCardRow title="Fee" value={fee} />
      </Stack>
    </InfoCard>
  );
}
