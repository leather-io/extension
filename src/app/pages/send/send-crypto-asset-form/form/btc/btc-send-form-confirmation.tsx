import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import get from 'lodash.get';

import { logger } from '@shared/logger';
import { createMoney } from '@shared/models/money.model';
import { RouteUrls } from '@shared/route-urls';

import { useHomeTabs } from '@app/common/hooks/use-home-tabs';
import { useRouteHeader } from '@app/common/hooks/use-route-header';
import { satToBtc } from '@app/common/money/unit-conversion';
import { Header } from '@app/components/header';
import { useCurrentBitcoinAddress } from '@app/query/bitcoin/address/address.hooks';

import { ConfirmationButton } from '../../components/confirmation/components/confirmation-button';
import { useBitcoinBroadcastTransaction } from '../../family/bitcoin/hooks/use-bitcoin-broadcast-transaction';
import { useSendFormNavigate } from '../../hooks/use-send-form-navigate';
import { BtcSendFormConfirmationDetails } from './btc-send-form-confirmation-details';

export function BtcSendFormConfirmation() {
  const location = useLocation();
  const navigate = useNavigate();
  const tx = get(location.state, 'tx');
  const recipient = get(location.state, 'recipient');
  const fee = get(location.state, 'fee');
  const { setActiveTabActivity } = useHomeTabs();
  const [isLoading, setIsLoading] = useState(false);
  const { refetch } = useCurrentBitcoinAddress();

  const { bitcoinDeserializedRawTransaction, bitcoinBroadcastTransaction } =
    useBitcoinBroadcastTransaction(tx);

  const nav = useSendFormNavigate();

  useRouteHeader(
    <Header
      hideActions
      onClose={() =>
        nav.backToSendForm({
          recipient,
          amount: satToBtc(
            bitcoinDeserializedRawTransaction.outputs[0].amount.toString()
          ).toString(),
        })
      }
      title="Confirm transaction"
    />
  );

  return (
    <>
      <BtcSendFormConfirmationDetails
        unsignedTx={bitcoinDeserializedRawTransaction}
        recipient={recipient}
        fee={createMoney(fee, 'BTC')}
      />
      <ConfirmationButton
        isLoading={isLoading}
        onClick={async () => {
          setIsLoading(true);
          const result = await bitcoinBroadcastTransaction();
          setIsLoading(false);
          logger.info(result);
          await refetch();
          navigate(RouteUrls.Home);
          setActiveTabActivity();
        }}
      />
    </>
  );
}
