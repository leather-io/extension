import { useLocation, useNavigate } from 'react-router-dom';

import get from 'lodash.get';

import { Sheet, SheetHeader } from '@leather.io/ui';

import { RouteUrls } from '@shared/route-urls';
import { analytics } from '@shared/utils/analytics';

import { useOnMount } from '@app/common/hooks/use-on-mount';

import { BroadcastErrorLayout } from './components/broadcast-error.layout';

interface Props {
  showInSheet?: boolean;
}

export function BroadcastError({ showInSheet = false }: Props) {
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

  if (showInSheet) {
    return (
      <Sheet
        header={<SheetHeader title="Error" />}
        isShowing
        onClose={() => navigate(RouteUrls.Home)}
      >
        {layout}
      </Sheet>
    );
  }

  return layout;
}
