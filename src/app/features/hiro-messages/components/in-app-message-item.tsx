import { Box, Flex, styled } from 'leather-styles/jsx';

import { HiroMessage } from '@app/query/common/remote-config/remote-config.query';
import { CloseIcon } from '@app/ui/components/icons/close-icon';

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
      p="space.04"
    >
      {dismissible && (
        <styled.button
          position="absolute"
          p="space.02"
          top={[0, 0, '50%']}
          mr="space.02"
          mt={['space.02', null, 'unset']}
          transform={[null, null, 'translateY(-50%)']}
          right={0}
          borderRadius="lg"
          _focus={{ outline: '1px solid white' }}
          onClick={() => onDismiss(id)}
        >
          <CloseIcon />
        </styled.button>
      )}
      {img && (
        <Box mb={['space.03', null, 'unset']}>
          <img width={imgWidth} src={img} />
        </Box>
      )}
      <Box fontSize="13px" lineHeight="20px">
        {title && (
          <styled.span display="block" lineHeight="inherit">
            {title}
          </styled.span>
        )}
        <styled.span
          display="inline"
          fontSize="inherit"
          ml={[null, null, 'space.04']}
          mr={['space.02', 'space.04']}
          lineHeight="inherit"
        >
          {text}
        </styled.span>
        {learnMoreUrl && (
          <styled.a
            display="inline-block"
            textDecoration="underline"
            href={learnMoreUrl}
            whiteSpace="nowrap"
            target="_blank"
          >
            {learnMoreText ? learnMoreText : 'Learn more ↗'}
          </styled.a>
        )}
      </Box>
    </Flex>
  );
}
