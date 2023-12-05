import { css } from 'leather-styles/css';
import { Box } from 'leather-styles/jsx';

import { HasChildren } from '@app/common/has-children';

//  Content wrapper used in Dialog + SendCryptoLayout
export function CardContent({ children }: HasChildren) {
  return (
    <Box
      className={css({
        height: '100%',
        // TODO - make this smarter to compute height based on if footer / header for more precision
        maxHeight: { base: 'calc(100vh - 160px)', md: 'calc(90vh - 160px)' },
        // 175px = headerHeight + footerHeight
        mb: '175px',
        overflowY: 'auto',
      })}
    >
      {children}
    </Box>
  );
}
