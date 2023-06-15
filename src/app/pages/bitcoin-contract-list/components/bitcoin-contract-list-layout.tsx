import { ReactNode } from 'react';

import { Stack } from '@stacks/ui';
import { Header } from '@app/components/header';
import { useRouteHeader } from '@app/common/hooks/use-route-header';
import { RouteUrls } from '@shared/route-urls';
import { useNavigate } from 'react-router-dom';

interface BitcoinContractListProps {
  children: ReactNode;
}
export function BitcoinContractListLayout({ children }: BitcoinContractListProps) {
  const navigate = useNavigate();
  useRouteHeader(<Header title='Bitcoin Contracts' onClose={() => navigate(RouteUrls.Home)}/>);
  return (
      <Stack width="100%" spacing="extra-tight" overflow={"scroll"}>
        {children}
      </Stack>
  );
}