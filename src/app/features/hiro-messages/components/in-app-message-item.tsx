import { Box, Flex, styled } from 'leather-styles/jsx';

import { HiroMessage } from '@app/query/common/remote-config/remote-config.query';
import { CloseIcon } from '@app/ui/icons/close-icon';

interface HiroMessageItemProps extends HiroMessage {
  onDismiss(id: string): void;
}
export function HiroMessageItem(props: HiroMessageItemProps) {
  const { id, title, text, learnMoreUrl, learnMoreText, img, imgWidth, dismissible, onDismiss } =
    props;

  return (
    <Flex position="relative" py="space.05" px="space.04" width="100%" justifyContent="center">
      <Flex pos="relative" flexDirection={['column', null, 'row']} width={['100%', null, '884px']}>
        {dismissible && (
          <styled.button
            position="absolute"
            p="space.02"
            top={['-16px', null, '50%']}
            // mr="space.02"
            mt={['space.02', null, 'unset']}
            transform={[null, null, 'translateY(-50%)']}
            right="-space.02"
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
            <styled.span textStyle="label.02" display="block" lineHeight="inherit">
              {title}
            </styled.span>
          )}
          <styled.span
            textStyle="caption.01"
            display="inline-block"
            fontSize="inherit"
            mr={['space.02', 'space.04']}
            mt="space.03"
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
    </Flex>
  );
}
