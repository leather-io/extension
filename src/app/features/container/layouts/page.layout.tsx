import { Outlet } from 'react-router-dom';

import { PageProvider } from '../../../common/page/page.context';
import { ContainerLayout } from './components/container.layout';
import { PageHeader } from './components/page.header';

export function PageLayout() {
  return (
    <PageProvider>
      <ContainerLayout header={<PageHeader />} content={<Outlet />} />
    </PageProvider>
  );
}
