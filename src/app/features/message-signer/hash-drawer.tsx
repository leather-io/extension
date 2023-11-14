import { useState } from 'react';

import { Box, styled } from 'leather-styles/jsx';

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
      <styled.button
        _focus={{ outline: 0, textDecoration: 'underline' }}
        _hover={{ cursor: 'pointer' }}
        onClick={() => {
          setDisplayHash(showHash ? '' : hash);
          setShowHash(!showHash);
        }}
        type="button"
        width="100%"
      >
        <styled.span py="space.02" textStyle="caption.01">
          {showHash ? 'Hide hash' : 'Show hash'}
        </styled.span>
        <Box marginBottom="auto" marginLeft="auto" marginTop="auto">
          <ShowHashButton expanded={showHash} />
        </Box>
      </styled.button>
      <Box
        height={showHash ? '100%' : '0'}
        transition="transition"
        visibility={showHash ? 'visible' : 'hidden'}
      >
        <styled.span
          color="accent.text-subdued"
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
