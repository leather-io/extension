import { Box } from 'leather-styles/jsx';

import { Approver } from '@leather.io/ui';

import type { HasChildren } from '@app/common/has-children';

export function ApproveTransactionSwitchAccount({ children }: HasChildren) {
  return (
    <Approver.Section>
      <Approver.Subheader>With account</Approver.Subheader>
      <Box mb="space.03">{children}</Box>
    </Approver.Section>
  );
}
