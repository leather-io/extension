import { ReactNode } from 'react';

import GenericError from '@assets/images/generic-error.png';
import { Box, Text, color } from '@stacks/ui';
import { Flex, FlexProps, HStack, styled } from 'leather-styles/jsx';

import { openInNewTab } from '@app/common/utils/open-in-new-tab';

import { LeatherButton } from '../button/button';
import { ExternalLinkIcon } from '../icons/external-link-icon';

const supportUrl =
  'https://wallet.hiro.so/wallet-faq/where-can-i-find-support-for-the-stacks-wallet';

interface GenericErrorProps extends FlexProps {
  body: string;
  helpTextList: ReactNode[];
  onClose(): void;
  title: string;
}
export function GenericErrorLayout(props: GenericErrorProps) {
  const { body, helpTextList, onClose, title, ...rest } = props;

  return (
    <Flex
      alignItems="center"
      flexDirection="column"
      px={['space.05', 'space.05', 'unset']}
      width="100%"
      {...rest}
    >
      <Box mt="loose">
        <img src={GenericError} width="106px" />
      </Box>
      <styled.h1 mt="space.05" textStyle="heading.04">
        {title}
      </styled.h1>
      <styled.h2
        mt="space.04"
        textAlign="center"
        textStyle="label.02"
        width="100%"
        wordWrap="break-word"
      >
        {body}
      </styled.h2>
      <Box
        as="ul"
        border="2px solid #EFEFF2"
        borderRadius="12px"
        color={color('text-caption')}
        fontSize="14px"
        lineHeight="1.6"
        listStyleType="circle"
        mt="extra-loose"
        pb="loose"
        pl="40px"
        pr="loose"
        pt="tight"
        textAlign="left"
        width="100%"
      >
        {helpTextList}
        <Box as="li" mt="base" textAlign="left">
          <HStack alignItems="center">
            <Text>Reach out to our support team</Text>
            <Box as="button" onClick={() => openInNewTab(supportUrl)}>
              <ExternalLinkIcon />
            </Box>
          </HStack>
        </Box>
      </Box>
      <LeatherButton fontSize="14px" mt="space.05" onClick={onClose} variant="link">
        Close window
      </LeatherButton>
    </Flex>
  );
}
