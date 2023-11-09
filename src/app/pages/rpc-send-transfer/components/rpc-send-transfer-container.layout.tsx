import { Flex } from 'leather-styles/jsx';

import { HasChildren } from '@app/common/has-children';

export function RpcSendTransferContainerLayout({ children }: HasChildren) {
  return (
    <Flex alignItems="center" flexDirection="column" p="loose" width="100%">
      {children}
    </Flex>
  );
}
