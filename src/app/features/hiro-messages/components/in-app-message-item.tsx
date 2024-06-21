import { Box, Flex, styled } from 'leather-styles/jsx';

import { CloseIcon } from '@leather.io/ui';

import { HiroMessage } from '@app/query/common/remote-config/remote-config.query';

interface HiroMessageItemProps extends HiroMessage {
  onDismiss(id: string): void;
}
export function HiroMessageItem(props: HiroMessageItemProps) {
  const { id, title, text, learnMoreUrl, learnMoreText, img, imgWidth, dismissible, onDismiss } =
    props;

  return (
    <Flex position="relative" py="space.05" px="space.05" width="100%" justifyContent="center">
      <Flex
        pos="relative"
        flexDirection={['column', null, 'row']}
        width="100%"
        maxWidth={{ base: '100vw', md: 'fullPageMaxWidth' }}
        px={['unset', 'space.05']}
      >
        {dismissible && (
          <styled.button
            position="absolute"
            p="space.02"
            top={['-16px', null, '50%']}
            mt={['space.02', null, 'unset']}
            transform={[null, null, 'translateY(-50%)']}
            right={['-space.02', 'space.04']}
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
        <Box>
          {title && (
            <styled.span textStyle="label.02" display="block" lineHeight="inherit">
              {title}
            </styled.span>
          )}
          <styled.span
            textStyle="label.02"
            display="inline-block"
            fontSize="inherit"
            mr="space.07"
            lineHeight="inherit"
          >
            {text}
            {learnMoreUrl && (
              <styled.a
                textStyle="label.02"
                textDecoration="underline"
                href={learnMoreUrl}
                whiteSpace="nowrap"
                target="_blank"
                ml="space.01"
              >
                {learnMoreText ? learnMoreText : 'Learn more →'}
              </styled.a>
            )}
          </styled.span>
        </Box>
      </Flex>
    </Flex>
  );
}
