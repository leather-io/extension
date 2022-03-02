import { Box, color, Flex, Text } from '@stacks/ui';
import { FiInfo } from 'react-icons/fi';

interface LedgerInfoLabelProps {
  children: React.ReactNode;
}
export const LedgerInfoLabel = (props: LedgerInfoLabelProps) => {
  const { children } = props;

  return (
    <Flex background="#F7F8FD" borderRadius="8px" p="base" {...props}>
      <Box mr="tight" mt="2px">
        <FiInfo size="16px" color={color('accent')} />
      </Box>
      <Box>
        {/* <Text display="block" textStyle="body.small.medium" lineHeight="20px">
          {title}
        </Text> */}
        <Text
          display="inline"
          textStyle="caption"
          fontSize="14px"
          mt="extra-tight"
          mr="extra-tight"
        >
          {children}
        </Text>
        {/* {learnMoreUrl && (
          <Text
            as="a"
            display="inline-block"
            textStyle="caption"
            textDecoration="underline"
            href={learnMoreUrl}
            whiteSpace="nowrap"
            target="_blank"
          >
            Learn more
          </Text>
        )} */}
      </Box>
    </Flex>
  );
};
