import { FiX } from 'react-icons/fi';

import { Box, Flex, Text } from '@stacks/ui';

import { HiroMessage } from '@app/query/common/hiro-config/hiro-config.query';

interface HiroMessageItemProps extends HiroMessage {
  onDismiss(id: string): void;
}

export function HiroMessageItem(props: HiroMessageItemProps) {
  const { id, title, text, learnMoreUrl, learnMoreText, img, imgWidth, dismissible, onDismiss } =
    props;

  return (
    <Flex
      flex={1}
      flexDirection={['column', null, 'row']}
      alignItems={[null, null, 'center']}
      justifyContent="center"
      position="relative"
      p="base"
    >
      {dismissible && (
        <Box
          as="button"
          position="absolute"
          p="tight"
          top={[0, 0, '50%']}
          mr={['tight']}
          mt={['tight', null, 'unset']}
          transform={[null, null, 'translateY(-50%)']}
          right={0}
          borderRadius="50%"
          _focus={{ outline: '1px solid white' }}
          onClick={() => onDismiss(id)}
        >
          <FiX />
        </Box>
      )}
      {img && (
        <Box mb={['base-tight', null, 'unset']}>
          <img width={imgWidth} src={img} />
        </Box>
      )}
      <Box fontSize="13px" lineHeight="20px">
        {title && (
          <Text display="block" lineHeight="inherit">
            {title}
          </Text>
        )}
        <Text
          display="inline"
          fontSize="inherit"
          ml={[null, null, 'base']}
          mr={['tight', 'base']}
          lineHeight="inherit"
        >
          {text}
        </Text>
        {learnMoreUrl && (
          <Text
            as="a"
            display="inline-block"
            textDecoration="underline"
            href={learnMoreUrl}
            whiteSpace="nowrap"
            target="_blank"
          >
            {learnMoreText ? learnMoreText : 'Learn more ↗'}
          </Text>
        )}
      </Box>
    </Flex>
  );
}
