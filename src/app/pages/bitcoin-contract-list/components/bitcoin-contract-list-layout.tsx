import { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';

import { Stack } from 'leather-styles/jsx';

import { RouteUrls } from '@shared/route-urls';

import { useRouteHeader } from '@app/common/hooks/use-route-header';
import { Header } from '@app/components/header';

interface BitcoinContractListProps {
  children: ReactNode;
}
export function BitcoinContractListLayout({ children }: BitcoinContractListProps) {
  const navigate = useNavigate();
  useRouteHeader(<Header title="Bitcoin Contracts" onClose={() => navigate(RouteUrls.Home)} />);
  return (
    <Stack padding="space.04" width="100%" overflow={'scroll'}>
      {children}
    </Stack>
  );
}
