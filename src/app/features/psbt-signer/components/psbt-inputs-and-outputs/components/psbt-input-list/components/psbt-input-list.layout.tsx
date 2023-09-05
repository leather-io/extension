import { Box } from 'leather-styles/jsx';

import { HasChildren } from '@app/common/has-children';

export function PsbtInputListLayout({ children }: HasChildren) {
  return (
    <Box pb="space.06">
      <Box borderLeft="1px solid #DCDDE2">{children}</Box>
    </Box>
  );
}
