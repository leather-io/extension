import { useState } from 'react';

import { Flex } from '@stacks/ui';
import { Box, styled } from 'leather-styles/jsx';
import { token } from 'leather-styles/tokens';

import { ChevronDownIcon } from '@app/ui/components/icons/chevron-down-icon';
import { ChevronUpIcon } from '@app/ui/components/icons/chevron-up-icon';

interface ShowHashButtonProps {
  expanded: boolean;
}
function ShowHashButton(props: ShowHashButtonProps) {
  const { expanded } = props;
  return expanded ? <ChevronUpIcon /> : <ChevronDownIcon />;
}

interface HashDrawerProps {
  hash: string;
}
export function HashDrawer(props: HashDrawerProps) {
  const { hash } = props;
  const [showHash, setShowHash] = useState(false);
  const [displayHash, setDisplayHash] = useState(hash);
  return (
    <Box px="space.05">
      <Flex
        as="button"
        width="100%"
        _hover={{ cursor: 'pointer' }}
        _focus={{ outline: 0, textDecoration: 'underline' }}
        onClick={() => {
          setDisplayHash(showHash ? '' : hash);
          setShowHash(!showHash);
        }}
      >
        <styled.span py="space.02" textStyle="caption.01">
          {showHash ? 'Hide hash' : 'Show hash'}
        </styled.span>
        <Box marginLeft="auto" marginTop="auto" marginBottom="auto">
          <ShowHashButton expanded={showHash} />
        </Box>
      </Flex>
      <Box
        transition="transition"
        height={showHash ? '100%' : '0'}
        visibility={showHash ? 'visible' : 'hidden'}
      >
        <styled.span
          color={token('colors.accent.text-subdued')}
          lineHeight="1.6"
          wordBreak="break-all"
          textStyle="caption.02"
        >
          {displayHash}
        </styled.span>
      </Box>
    </Box>
  );
}
