import { ReactNode } from 'react';

import BroadcastError from '@assets/images/unhappy-face-ui.png';
import { Box, Flex, FlexProps, styled } from 'leather-styles/jsx';
import { token } from 'leather-styles/tokens';

import { Title } from '@app/components/typography';

interface BroadcastErrorProps extends FlexProps {
  title: string;
  body: string;
  errorPayload: ReactNode;
  children?: ReactNode;
}
export function BroadcastErrorLayout(props: BroadcastErrorProps) {
  const { body, errorPayload, title, children, ...rest } = props;

  return (
    <Flex
      alignItems="center"
      flexDirection="column"
      px={['space.05', 'unset']}
      width="100%"
      {...rest}
    >
      <Box mt="space.05">
        <img src={BroadcastError} alt="Unhappy user interface cloud" width="106px" />
      </Box>
      <Title fontSize={4} mx="space.05" mt="base-loose" lineHeight={1.5}>
        {title}
      </Title>
      <styled.span
        textStyle="caption.02"
        // color={token('colors.accent.text-subdued')}
        fontSize="16px"
        lineHeight="1.6"
        mt="space.04"
        textAlign="center"
      >
        {body}
      </styled.span>
      {errorPayload && (
        <Box
          p="space.04"
          borderRadius="10px"
          textAlign="left"
          fontSize="12px"
          mx="space.05"
          mt="space.05"
          background={token('colors.accent.background-secondary')}
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
