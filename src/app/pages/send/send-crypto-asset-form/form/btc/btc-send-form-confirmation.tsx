import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import get from 'lodash.get';

import { createMoney } from '@shared/models/money.model';
import { RouteUrls } from '@shared/route-urls';

import { useAnalytics } from '@app/common/hooks/analytics/use-analytics';
import { useHomeTabs } from '@app/common/hooks/use-home-tabs';
import { useRouteHeader } from '@app/common/hooks/use-route-header';
import { satToBtc } from '@app/common/money/unit-conversion';
import { Header } from '@app/components/header';
import { useCurrentNativeSegwitUtxos } from '@app/query/bitcoin/address/address.hooks';

import { ConfirmationButton } from '../../components/confirmation/components/confirmation-button';
import { SendFormConfirmationLayout } from '../../components/confirmation/components/send-form-confirmation.layout';
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
  const { refetch } = useCurrentNativeSegwitUtxos();
  const analytics = useAnalytics();
  const { psbt, broadcastTransaction } = useBitcoinBroadcastTransaction(tx);

  const nav = useSendFormNavigate();

  const transferAmount = satToBtc(psbt.outputs[0].amount.toString()).toString();

  useRouteHeader(
    <Header
      hideActions
      onClose={() =>
        nav.backToSendForm({
          recipient,
          amount: transferAmount,
        })
      }
      title="Confirm transaction"
    />
  );

  return (
    <SendFormConfirmationLayout>
      <BtcSendFormConfirmationDetails
        unsignedTx={psbt}
        recipient={recipient}
        fee={createMoney(fee, 'BTC')}
      />
      <ConfirmationButton
        isLoading={isLoading}
        onClick={async () => {
          try {
            setIsLoading(true);
            await broadcastTransaction();
            void analytics.track('broadcast_transaction', {
              token: 'btc',
              amount: transferAmount,
              fee,
              inputs: psbt.inputs.length,
              outputs: psbt.inputs.length,
            });
            await refetch();
            navigate(RouteUrls.Home);
            setActiveTabActivity();
          } catch (e) {
            nav.toErrorPage(e);
          } finally {
            setIsLoading(false);
          }
        }}
      />
    </SendFormConfirmationLayout>
  );
}
