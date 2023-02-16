import { FiPlus } from 'react-icons/fi';

import { Box, Text, color } from '@stacks/ui';

import { Caption } from '@app/components/typography';

export function AddCollectibles() {
  return (
    <Box>
      <Box pb="base">
        <Box
          sx={{
            position: 'relative',
            paddingBottom: '100%',
            height: '0',
          }}
        >
          <Box
            onClick={() => {
              // TODO
              alert('TODO Add collectible');
            }}
            borderRadius="12px"
            backgroundColor="#EEF2FB" // NOTE: color not yet available from `@stacks/ui`.
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            _hover={{ cursor: 'pointer' }}
          >
            <FiPlus />
          </Box>
        </Box>
      </Box>
      <Box pb="base-tight">
        <Text pb="extra-tight" fontWeight="500" color={color('text-body')}>
          Add new
        </Text>

        {/* NOTE: using `style` since font size gets overriden when using `fontSize` or `sx`. */}
        <Caption style={{ fontSize: '12px' }}>Ordinal inscription</Caption>
      </Box>
    </Box>
  );
}
