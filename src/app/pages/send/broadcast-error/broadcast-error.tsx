import { useLocation, useNavigate } from 'react-router-dom';

import get from 'lodash.get';

import { Dialog } from '@leather.io/ui';

import { RouteUrls } from '@shared/route-urls';
import { analytics } from '@shared/utils/analytics';

import { useOnMount } from '@app/common/hooks/use-on-mount';
import { DialogHeader } from '@app/components/layout/dialog-header';

import { BroadcastErrorLayout } from './components/broadcast-error.layout';

interface Props {
  showInDialog?: boolean;
}

export function BroadcastError({ showInDialog = false }: Props) {
  const { state } = useLocation();
  const navigate = useNavigate();

  const msg = get(state, 'error.message', 'Unknown error response');
  const title = get(state, 'title', 'There was an error broadcasting your transaction');
  const body = get(state, 'body', 'Unable to broadcast transaction');

  useOnMount(() => void analytics.track('bitcoin_contract_error', { msg }));

  const layout = (
    <BroadcastErrorLayout
      my="space.05"
      textAlign="center"
      errorPayload={msg}
      title={title}
      body={body}
    />
  );

  if (showInDialog) {
    return (
      <Dialog
        header={<DialogHeader title="Error" />}
        isShowing
        onClose={() => navigate(RouteUrls.Home)}
      >
        {layout}
      </Dialog>
    );
  }

  return layout;
}
