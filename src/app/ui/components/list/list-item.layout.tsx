import { ReactNode } from 'react';

import { Flex } from 'leather-styles/jsx';

interface ListItemLayoutProps {
  contentLeft?: ReactNode;
  contentRight?: ReactNode;
}
export function ListItemLayout({ contentLeft, contentRight }: ListItemLayoutProps) {
  return (
    <Flex alignItems="center" justifyContent="space-between" p="space.03" width="100%">
      {contentLeft}
      {contentRight}
    </Flex>
  );
}
