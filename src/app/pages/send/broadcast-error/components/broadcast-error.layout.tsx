import { ReactNode } from 'react';

import BroadcastError from '@assets/images/unhappy-face-ui.png';
import { Box, Flex, FlexProps, Text, color } from '@stacks/ui';
import { styled } from 'leather-styles/jsx';

interface BroadcastErrorProps extends FlexProps {
  title: string;
  body: string;
  errorPayload: ReactNode;
  children?: ReactNode;
}
export function BroadcastErrorLayout(props: BroadcastErrorProps) {
  const { body, errorPayload, title, children, ...rest } = props;

  return (
    <Flex alignItems="center" flexDirection="column" px={['loose', 'unset']} width="100%" {...rest}>
      <Box mt="loose">
        <img src={BroadcastError} alt="Unhappy user interface cloud" width="106px" />
      </Box>
      <styled.span mx="space.05" mt="space.05" textStyle="heading.05">
        {title}
      </styled.span>
      <Text
        color={color('text-caption')}
        fontSize="16px"
        lineHeight="1.6"
        mt="base"
        textAlign="center"
      >
        {body}
      </Text>
      {errorPayload && (
        <Box
          p="base"
          borderRadius="10px"
          textAlign="left"
          fontSize="12px"
          mx="loose"
          mt="loose"
          background={color('bg-4')}
          color="ink.600"
          fontFamily="mono"
          wordBreak="break-all"
        >
          {errorPayload}
        </Box>
      )}
      {children}
    </Flex>
  );
}
