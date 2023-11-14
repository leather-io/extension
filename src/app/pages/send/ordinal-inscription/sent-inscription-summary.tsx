import { toast } from 'react-hot-toast';
import { useLocation, useNavigate } from 'react-router-dom';

import { Box, Stack } from 'leather-styles/jsx';
import get from 'lodash.get';

import { Blockchains } from '@shared/models/blockchain.model';
import { SupportedInscription } from '@shared/models/inscription.model';
import { RouteUrls } from '@shared/route-urls';

import { useAnalytics } from '@app/common/hooks/analytics/use-analytics';
import { useClipboard } from '@app/common/hooks/use-copy-to-clipboard';
import { useExplorerLink } from '@app/common/hooks/use-explorer-link';
import { FormAddressDisplayer } from '@app/components/address-displayer/form-address-displayer';
import { BaseDrawer } from '@app/components/drawer/base-drawer';
import {
  InfoCard,
  InfoCardBtn,
  InfoCardRow,
  InfoCardSeparator,
} from '@app/components/info-card/info-card';
import { InscriptionPreview } from '@app/components/inscription-preview-card/components/inscription-preview';
import { CheckmarkIcon } from '@app/ui/components/icons/checkmark-icon';
import { CopyIcon } from '@app/ui/components/icons/copy-icon';
import { ExternalLinkIcon } from '@app/ui/components/icons/external-link-icon';

import { InscriptionPreviewCard } from '../../../components/inscription-preview-card/inscription-preview-card';

function useSendInscriptionSummaryState() {
  const location = useLocation();
  return {
    txId: get(location.state, 'txId') as string,
    recipient: get(location.state, 'recipient', '') as string,
    arrivesIn: get(location.state, 'arrivesIn') as string,
    inscription: get(location.state, 'inscription') as SupportedInscription,
    feeRowValue: get(location.state, 'feeRowValue') as string,
  };
}

export function SendInscriptionSummary() {
  const { txId, recipient, arrivesIn, inscription, feeRowValue } = useSendInscriptionSummaryState();

  const navigate = useNavigate();
  const txLink = {
    blockchain: 'bitcoin' as Blockchains,
    txId,
  };

  const { onCopy } = useClipboard(txId || '');
  const { handleOpenTxLink } = useExplorerLink();
  const analytics = useAnalytics();

  function onClickLink() {
    void analytics.track('view_transaction_confirmation', { symbol: 'BTC' });
    handleOpenTxLink(txLink);
  }

  function onClickCopy() {
    onCopy();
    toast.success('ID copied!');
  }

  return (
    <BaseDrawer title="Sent" isShowing onClose={() => navigate(RouteUrls.Home)}>
      <Box mt="space.06" px="space.06">
        <InscriptionPreviewCard
          icon={<CheckmarkIcon mt="space.01" size="32px" />}
          image={<InscriptionPreview inscription={inscription} />}
          subtitle="Ordinal inscription"
          title={inscription.title}
        />
      </Box>

      <InfoCard pt="space.06" pb="space.06" px="space.06">
        <Stack mb="space.06" width="100%">
          <InfoCardRow title="To" value={<FormAddressDisplayer address={recipient} />} />
          <InfoCardSeparator />
          {arrivesIn && <InfoCardRow title="Estimated confirmation time" value={arrivesIn} />}
          <InfoCardRow title="Fee" value={feeRowValue} />
        </Stack>

        <Stack gap="space.04" width="100%">
          <InfoCardBtn
            onClick={onClickLink}
            icon={<ExternalLinkIcon size="14px" />}
            label="View details"
          />
          <InfoCardBtn onClick={onClickCopy} icon={<CopyIcon size="14px" />} label="Copy ID" />
        </Stack>
      </InfoCard>
    </BaseDrawer>
  );
}
