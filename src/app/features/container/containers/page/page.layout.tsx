import { ContainerLayout } from '../container.layout';
import { Header } from './header';
import { PageProvider } from './page.context';

interface PageLayoutProps {
  children?: React.JSX.Element | React.JSX.Element[];
}
export function PageLayout({ children }: PageLayoutProps) {
  return (
    <PageProvider>
      <ContainerLayout header={<Header />} content={children} />
    </PageProvider>
  );
}
