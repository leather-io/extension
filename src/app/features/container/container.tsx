import { Outlet, useNavigate } from 'react-router-dom';

import { noop } from '@shared/utils';

import { useOnMount } from '@app/common/hooks/use-on-mount';
import { whenPageMode } from '@app/common/utils';
import { useRouteHeaderState } from '@app/store/ui/ui.hooks';

import { ContainerLayout } from './container.layout';

export function Container() {
  const [routeHeader] = useRouteHeaderState();
  const navigate = useNavigate();

  useOnMount(() =>
    whenPageMode({
      full: noop,
      popup: () => {
        try {
          const storageVal = localStorage.getItem('btc-form-state');
          if (!storageVal) return;
          const result = JSON.parse(storageVal);
          navigate('send/btc', { state: result });
          localStorage.removeItem('btc-form-state');
        } catch (e) {}
      },
    })()
  );

  return (
    <ContainerLayout header={routeHeader}>
      <Outlet />
    </ContainerLayout>
  );
}
