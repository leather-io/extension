import { ContainerLayout } from '../container.layout';
import { PageProvider } from './page.context';
import { PageHeader } from './page.header';

interface PageLayoutProps {
  children?: React.JSX.Element | React.JSX.Element[];
}
export function PageLayout({ children }: PageLayoutProps) {
  return (
    <PageProvider>
      <ContainerLayout header={<PageHeader />} content={children} />
    </PageProvider>
  );
}
