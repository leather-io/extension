import { Box, Flex, Text, color, Button } from '@stacks/ui';

import { Title } from '@app/components/typography';
import ErrorIcon from '@assets/images/generic-error-icon.png';

export function AuthWithLedgerError() {
  return (
    <Flex flexDirection="column" px={['loose', 'unset']} width="100%" alignItems="center">
      <Box mt="52px">
        <img src={ErrorIcon} width="106px" height="72px" />
      </Box>
      <Title fontSize={4} mt="loose">
        Unsupported wallet type
      </Title>
      <Text
        mt="base-tight"
        textAlign="center"
        fontSize="16px"
        lineHeight="1.6"
        color={color('text-caption')}
      >
        Ledger devices don't currently support authentication. We're working to support this feature
        soon.
      </Text>
      <Box
        as="ul"
        border="2px solid #EFEFF2"
        borderRadius="12px"
        mt="extra-loose"
        width="100%"
        lineHeight="1.6"
        fontSize="14px"
        py="loose"
        px="base"
        pl="40px"
        color={color('text-caption')}
      >
        <Box as="li">
          In the meantime, you can try creating a software wallet.{' '}
          <Text
            as="button"
            color={color('accent')}
            onClick={() => {
              void chrome.tabs.create({ url: chrome.runtime.getURL('index.html#/sign-out') });
              window.close();
            }}
          >
            Sign out of your Ledger wallet.
          </Text>
        </Box>
        <Box as="li" mt="base">
          Still stuck? Reach out to support@hiro.so
        </Box>
      </Box>
      <Button
        variant="link"
        p="base"
        fontSize="14px"
        mt="base-tight"
        onClick={() => window.close()}
      >
        Close window
      </Button>
    </Flex>
  );
}
