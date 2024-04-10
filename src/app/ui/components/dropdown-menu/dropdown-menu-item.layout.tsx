import { ReactNode } from 'react';

import { Flex } from 'leather-styles/jsx';

interface DropdownMenuItemLayoutProps {
  contentLeft: ReactNode;
  contentRight?: ReactNode;
}
export function DropdownMenuItemLayout({ contentLeft, contentRight }: DropdownMenuItemLayoutProps) {
  return (
    <Flex alignItems="center" justifyContent="space-between" width="100%">
      {contentLeft}
      {contentRight}
    </Flex>
  );
}
