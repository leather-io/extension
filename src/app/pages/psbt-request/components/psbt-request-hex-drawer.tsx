import { useState } from 'react';
import { FiChevronDown, FiChevronUp } from 'react-icons/fi';

import { Box, Flex, Text } from '@stacks/ui';

interface ShowHexButtonProps {
  expanded: boolean;
}
const ShowHexButton = (props: ShowHexButtonProps) => {
  const { expanded } = props;
  return <Box as={expanded ? FiChevronUp : FiChevronDown} size="16px" />;
};

interface PsbtRequestHexDrawerProps {
  hex: string;
}
export function PsbtRequestHexDrawer(props: PsbtRequestHexDrawerProps) {
  const { hex } = props;
  const [showHex, setShowHex] = useState(false);
  const [displayHex, setDisplayHex] = useState(hex);

  return (
    <Box px="loose">
      <Flex
        as="button"
        width="100%"
        _hover={{ cursor: 'pointer' }}
        _focus={{ outline: 0, textDecoration: 'underline' }}
        onClick={() => {
          setDisplayHex(showHex ? '' : hex);
          setShowHex(!showHex);
        }}
      >
        <Text display="block" fontSize={1} py="tight">
          {showHex ? 'Hide hex' : 'Show hex'}
        </Text>
        <Box marginLeft="auto" marginTop="auto" marginBottom="auto">
          <ShowHexButton expanded={showHex} />
        </Box>
      </Flex>
      <Box
        transition="all 0.65s cubic-bezier(0.23, 1, 0.32, 1)"
        height={showHex ? '100%' : '0'}
        visibility={showHex ? 'visible' : 'hidden'}
      >
        <Text
          display="block"
          color="#74777D"
          fontSize={1}
          lineHeight="1.6"
          wordBreak="break-all"
          fontFamily="Fira Code"
        >
          {displayHex}
        </Text>
      </Box>
    </Box>
  );
}
