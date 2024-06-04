import { Box, Flex, styled } from 'leather-styles/jsx';

import { Button, LettermarkIcon, LogomarkIcon } from '@leather-wallet/ui';

import { RequesterFlag } from '@app/components/requester-flag';

interface GetAddressesLayoutProps {
  requester: string;
  onUserApproveGetAddresses(): void;
}
export function GetAddressesLayout(props: GetAddressesLayoutProps) {
  const { requester, onUserApproveGetAddresses } = props;

  return (
    <Flex flexDirection="column" height="100vh" width="100%">
      <Flex
        flex={1}
        flexDirection="column"
        textAlign="center"
        alignItems="center"
        p="space.06"
        gap="space.06"
      >
        <Box mb="space.08" mt="space.11">
          <LogomarkIcon width="248px" height="58px" />
        </Box>
        <styled.p textStyle="heading.03">Connect your account to</styled.p>

        <RequesterFlag requester={requester} />
        <Box width="100%" display="flex">
          <Button onClick={() => onUserApproveGetAddresses()} fullWidth>
            <Flex justifyContent="center" alignItems="center">
              <LettermarkIcon mr="space.02" />
              <styled.span textStyle="label.02">Connect Leather</styled.span>
            </Flex>
          </Button>
        </Box>
      </Flex>
      <Flex
        px="space.05"
        py="space.03"
        lineHeight="20px"
        textAlign="center"
        alignSelf="bottom"
        bg="ink.background-secondary"
      >
        <styled.p textStyle="caption.01">
          By connecting you give permission to {requester} to see all addresses linked to this
          account
        </styled.p>
      </Flex>
    </Flex>
  );
}
