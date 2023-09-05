import { Box } from 'leather-styles/jsx';

import { HasChildren } from '@app/common/has-children';

export function PsbtOutputListLayout({ children }: HasChildren) {
  return (
    <Box>
      <Box borderLeft="1px solid #DCDDE2">{children}</Box>
    </Box>
  );
}
