import { ReactNode } from 'react';

import { Box, Text } from '@stacks/ui';
import type { BoxProps } from '@stacks/ui';
import { color } from '@stacks/ui-utils';

import { Caption } from '@app/components/typography';

export interface BaseCollectibleProps {
  title: string;
  subtitle: string;
  backgroundElementProps?: BoxProps;
  onClick: () => void;
  children: ReactNode;
}
export function BaseCollectible({
  title,
  subtitle,
  onClick,
  backgroundElementProps,
  children,
}: BaseCollectibleProps) {
  return (
    <Box as="button" onClick={onClick}>
      <Box pb="base">
        <Box
          sx={{
            position: 'relative',
            paddingBottom: '100%',
            height: '0',
          }}
        >
          <Box
            borderRadius="16px"
            backgroundColor="black"
            sx={{
              overflow: 'hidden',
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            {...backgroundElementProps}
          >
            {children}
          </Box>
        </Box>
      </Box>
      <Box pb="base-tight" pl="tight" textAlign="initial">
        <Text pb="extra-tight" fontWeight="500" color={color('text-body')}>
          {title}
        </Text>

        {/* NOTE: using `style` since font size gets overriden when using `fontSize` or `sx`. */}
        <Caption style={{ fontSize: '12px' }}>{subtitle}</Caption>
      </Box>
    </Box>
  );
}
