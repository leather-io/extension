import { Box } from '@stacks/ui';

import { HasChildren } from '@app/common/has-children';

export function PsbtInputListLayout({ children }: HasChildren) {
  return (
    <Box pb="extra-loose">
      <Box borderLeft="1px solid #DCDDE2">{children}</Box>
    </Box>
  );
}
