import type { Meta } from '@storybook/react';

import { ContainerLayout } from '@app/ui/components/containers/container.layout';
import { PageHeader } from '@app/ui/components/containers/headers/header.stories';
import { Card } from '@app/ui/layout/card/card.stories';

// import { Card } from '@app/ui/layout/card/card';
import { Page as Component } from './page.layout';

const meta: Meta<typeof Component> = {
  component: Component,
  tags: ['autodocs'],
  title: 'Layout/Page',
};

export default meta;

export function Page() {
  return (
    <ContainerLayout header={<PageHeader variant="home" />}>
      <Component>
        <Card />
      </Component>
    </ContainerLayout>
  );
}
