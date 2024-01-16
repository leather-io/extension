import { ReactNode } from 'react';

import { Flex } from 'leather-styles/jsx';

interface SelectItemLayoutProps {
  contentLeft: ReactNode;
  contentRight?: ReactNode;
}
export function SelectItemLayout({ contentLeft, contentRight }: SelectItemLayoutProps) {
  return (
    <Flex alignItems="center" justifyContent="space-between" width="100%">
      {contentLeft}
      {contentRight}
    </Flex>
  );
}
