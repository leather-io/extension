import { ReactNode } from 'react';

import BroadcastError from '@assets/images/unhappy-face-ui.png';
import { SharedComponentsSelectors } from '@tests/selectors/shared-component.selectors';
import { Box, Flex, FlexProps, styled } from 'leather-styles/jsx';

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
      <styled.span
        data-testid={SharedComponentsSelectors.BroadcastErrorTitle}
        mx="space.05"
        mt="space.05"
        textStyle="heading.05"
      >
        {title}
      </styled.span>
      <styled.span color="ink.text-subdued" mt="space.04" textAlign="center" textStyle="body.02">
        {body}
      </styled.span>
      {errorPayload && (
        <Box
          bg="ink.component-background-default"
          borderRadius="sm"
          mt="space.05"
          mx="space.05"
          p="space.04"
          textAlign="left"
          textStyle="code"
          fontSize="10px"
          wordBreak="break-all"
        >
          {errorPayload}
        </Box>
      )}
      {children}
    </Flex>
  );
}
