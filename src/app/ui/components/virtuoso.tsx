import { ReactNode, useState } from 'react';

import { Box } from 'leather-styles/jsx';

import { useViewportMinWidth } from '@app/common/hooks/use-media-query';
import { useOnResizeListener } from '@app/common/hooks/use-on-resize-listener';

interface VirtuosoWrapper {
  children: ReactNode;
  hasFooter?: boolean;
  isPopup?: boolean;
}

function vhToPixels(vh: string) {
  const numericHeight = +vh.replace('vh', '');
  return (numericHeight * window.innerHeight) / 100;
}

export function VirtuosoWrapper({ children, hasFooter, isPopup }: VirtuosoWrapper) {
  const [key, setKey] = useState(0);
  const isAtLeastMd = useViewportMinWidth('md');
  const virtualHeight = isAtLeastMd ? '70vh' : '100vh';
  const headerHeight = isPopup ? 230 : 60;
  const footerHeight = hasFooter ? 95 : 0;
  const heightOffset = headerHeight + footerHeight;
  const height = vhToPixels(virtualHeight) - heightOffset;

  const onResize = () => {
    setKey(Date.now());
  };

  useOnResizeListener(onResize);
  return (
    <Box
      key={key}
      pt="space.03"
      overflow="hidden"
      style={{
        height: height,
        marginBottom: hasFooter ? `${footerHeight}px` : '10px',
      }}
    >
      {children}
    </Box>
  );
}
