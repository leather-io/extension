import type { QueryObserverResult } from '@tanstack/react-query';
import { Box, styled } from 'leather-styles/jsx';

import { ItemLayout } from '@leather.io/ui';

interface CryptoAssetItemErrorProps {
  caption: string;
  icon: React.ReactNode;
  onRefetch?(): Promise<QueryObserverResult<unknown, unknown>>;
  title: string;
}
export function CryptoAssetItemError({
  caption,
  icon,
  onRefetch,
  title,
}: CryptoAssetItemErrorProps) {
  return (
    <Box my="space.02">
      <ItemLayout
        img={icon}
        titleLeft={title}
        captionLeft={caption}
        titleRight={
          <styled.span color="ink.text-subdued" textStyle="label.02">
            Unable to load
          </styled.span>
        }
        captionRight={
          onRefetch && (
            <styled.button lineHeight="20px" onClick={onRefetch}>
              <styled.span textStyle="caption.01">Retry</styled.span>
            </styled.button>
          )
        }
      />
    </Box>
  );
}
