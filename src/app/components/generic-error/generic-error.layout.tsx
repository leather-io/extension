import { ReactNode } from 'react';

import GenericError from '@assets/images/generic-error.png';
import { Box, Button, Flex, Text, color } from '@stacks/ui';

import { Title } from '@app/components/typography';

interface ErrorProps {
  body: string;
  helpTextList: ReactNode[];
  onClose(): void;
  title: string;
}
export function GenericErrorLayout(props: ErrorProps) {
  const { body, helpTextList, onClose, title } = props;

  return (
    <Flex alignItems="center" flexDirection="column" px={['loose', 'unset']} width="100%">
      <Box mt="loose">
        <img src={GenericError} width="106px" />
      </Box>
      <Title fontSize={4} mt="loose">
        {title}
      </Title>
      <Text
        color={color('text-caption')}
        fontSize="16px"
        lineHeight="1.6"
        mt="base"
        textAlign="center"
      >
        {body}
      </Text>
      <Box
        as="ul"
        border="2px solid #EFEFF2"
        borderRadius="12px"
        color={color('text-caption')}
        fontSize="14px"
        lineHeight="1.6"
        mt="extra-loose"
        pb="loose"
        pl="40px"
        pr="loose"
        pt="tight"
        width="100%"
      >
        {helpTextList}
        <Box as="li" mt="base">
          Still stuck? Reach out to support@hiro.so
        </Box>
      </Box>
      <Button fontSize="14px" mt="base-tight" onClick={onClose} p="base" variant="link">
        Close window
      </Button>
    </Flex>
  );
}
