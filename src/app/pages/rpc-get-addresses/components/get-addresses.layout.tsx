import { Box, Flex, styled } from 'leather-styles/jsx';

import { LeatherButton } from '@app/components/button/button';
import { LIcon } from '@app/components/icons/l-icon';
import { RequesterFlag } from '@app/components/requester-flag';
import { LeatherIcon } from '@app/ui/components/icons/leather-icon';

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
          <LeatherIcon width="248px" height="58px" />
        </Box>
        <styled.p textStyle="heading.03">Connect your account to</styled.p>

        <RequesterFlag requester={requester} />
        <Box width="100%" display="flex">
          <LeatherButton onClick={() => onUserApproveGetAddresses()} fullWidth>
            <Flex justifyContent="center" alignItems="center">
              <Box mr="space.02">
                <LIcon />
              </Box>
              <styled.span textStyle="label.02">Connect Leather</styled.span>
            </Flex>
          </LeatherButton>
        </Box>
      </Flex>
      <Flex
        px="space.05"
        py="space.03"
        lineHeight="20px"
        textAlign="center"
        alignSelf="bottom"
        bg="accent.background-secondary"
      >
        <styled.p textStyle="caption.02">
          By connecting you give permission to {requester} to see all addresses linked to this
          account
        </styled.p>
      </Flex>
    </Flex>
  );
}
