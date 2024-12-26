import { Box } from 'leather-styles/jsx';

import { RouteUrls } from '@shared/route-urls';

import type { HasChildren } from '@app/common/has-children';
import { Content, Page } from '@app/components/layout';
import { PageHeader } from '@app/features/container/headers/page.header';

export function SwapFormLayout({ children }: HasChildren) {
  return (
    <Box width="100%">
      <PageHeader title="Swap" onBackLocation={RouteUrls.Home} />
      <Content>
        <Page>{children}</Page>
      </Content>
    </Box>
  );
}
