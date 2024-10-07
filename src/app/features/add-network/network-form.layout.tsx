import { ReactNode } from 'react';

import { Content, Page } from '@app/components/layout';
import { PageHeader } from '@app/features/container/headers/page.header';

interface NetworkFormLayoutProps {
  title: string;
  children: ReactNode;
}

export function NetworkFormLayout({ title, children }: NetworkFormLayoutProps) {
  return (
    <>
      <PageHeader title={title} />
      <Content>
        <Page>{children}</Page>
      </Content>
    </>
  );
}
