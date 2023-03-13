import { toast } from 'react-hot-toast';
import { FiCheck, FiCopy, FiExternalLink } from 'react-icons/fi';
import { useLocation, useNavigate } from 'react-router-dom';

import { Stack, useClipboard } from '@stacks/ui';

import { RouteUrls } from '@shared/route-urls';

import { useAnalytics } from '@app/common/hooks/analytics/use-analytics';
import { useExplorerLink } from '@app/common/hooks/use-explorer-link';
import { useRouteHeader } from '@app/common/hooks/use-route-header';
import { FormAddressDisplayer } from '@app/components/address-displayer/form-address-displayer';
import { Header } from '@app/components/header';
import {
  InfoCard,
  InfoCardAssetValue,
  InfoCardBtn,
  InfoCardRow,
  InfoCardSeparator,
} from '@app/components/info-card/info-card';

export function BtcSentSummary() {
  const { state } = useLocation();
  const navigate = useNavigate();

  const {
    txId,
    txValue,
    txFiatValue,
    symbol,
    txLink,
    arrivesIn,
    sendingValue,
    recipient,
    fee,
    totalSpend,
  } = state;

  const { onCopy } = useClipboard(txId);
  const { handleOpenTxLink } = useExplorerLink();
  const analytics = useAnalytics();

  const onClickLink = () => {
    void analytics.track('view_transaction_confirmation', { symbol: 'BTC' });
    handleOpenTxLink(txLink);
  };
  const onClickCopy = () => {
    onCopy();
    toast.success('ID copied!');
  };

  useRouteHeader(
    <Header hideActions onClose={() => navigate(RouteUrls.Home)} title="Sent" closeIcon />
  );

  return (
    <InfoCard pt="extra-loose" pb="base-loose" px="extra-loose">
      <InfoCardAssetValue value={txValue} fiatValue={txFiatValue} symbol={symbol} icon={FiCheck} />

      <Stack width="100%" mb="44px">
        <InfoCardRow title="To" value={<FormAddressDisplayer address={recipient} />} />
        <InfoCardSeparator />
        <InfoCardRow title="Total spend" value={totalSpend} />

        <InfoCardRow title="Sending" value={sendingValue} />
        <InfoCardRow title="Fee" value={fee} />
        <InfoCardRow title="Arrives in" value={arrivesIn} />
      </Stack>

      <Stack spacing="base" isInline width="100%">
        <InfoCardBtn onClick={onClickLink} icon={FiExternalLink} label="View Details" />
        <InfoCardBtn onClick={onClickCopy} icon={FiCopy} label="Copy ID" />
      </Stack>
    </InfoCard>
  );
}
