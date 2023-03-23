import { useState } from 'react';
import { FiChevronDown, FiChevronUp } from 'react-icons/fi';

import { Box, Flex, Text } from '@stacks/ui';

import { figmaTheme } from '@app/common/utils/figma-theme';

interface ShowHashButtonProps {
  expanded: boolean;
}
function ShowHashButton(props: ShowHashButtonProps) {
  const { expanded } = props;
  return <Box as={expanded ? FiChevronUp : FiChevronDown} size="16px" />;
}

interface HashDrawerProps {
  hash: string;
}
export function HashDrawer(props: HashDrawerProps) {
  const { hash } = props;
  const [showHash, setShowHash] = useState(false);
  const [displayHash, setDisplayHash] = useState(hash);
  return (
    <Box px="loose">
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
        <Text display="block" fontSize={1} py="tight">
          {showHash ? 'Hide hash' : 'Show hash'}
        </Text>
        <Box marginLeft="auto" marginTop="auto" marginBottom="auto">
          <ShowHashButton expanded={showHash} />
        </Box>
      </Flex>
      <Box
        transition="all 0.65s cubic-bezier(0.23, 1, 0.32, 1)"
        height={showHash ? '100%' : '0'}
        visibility={showHash ? 'visible' : 'hidden'}
      >
        <Text
          display="block"
          color={figmaTheme.textSubdued}
          fontSize={1}
          lineHeight="1.6"
          wordBreak="break-all"
          fontFamily="Fira Code"
        >
          {displayHash}
        </Text>
      </Box>
    </Box>
  );
}
