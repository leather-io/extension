import { FC } from 'react';
import { Box, color, Flex, Text } from '@stacks/ui';
import { FiInfo } from 'react-icons/fi';
import { HiroMessage } from '@app/query/hiro-config/hiro-config.query';

export const HiroMessageItem: FC<HiroMessage> = props => {
  const { title, text, learnMoreUrl, learnMoreText } = props;

  return (
    <Flex>
      <Box mr="tight" mt="2px">
        <FiInfo size="16px" color={color('accent')} />
      </Box>
      <Box>
        <Text display="block" textStyle="body.small.medium" lineHeight="20px">
          {title}
        </Text>
        <Text display="inline" textStyle="caption" mt="extra-tight" mr="extra-tight">
          {text}
        </Text>
        {learnMoreUrl && (
          <Text
            as="a"
            display="inline-block"
            textStyle="caption"
            textDecoration="underline"
            href={learnMoreUrl}
            whiteSpace="nowrap"
            target="_blank"
          >
            {learnMoreText ? learnMoreText : 'Learn more'}
          </Text>
        )}
      </Box>
    </Flex>
  );
};
