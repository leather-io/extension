import { Box, Flex, styled } from 'leather-styles/jsx';

import { RequesterFlag } from '@app/components/requester-flag';
import { Button } from '@app/ui/components/button/button';
import { LettermarkIcon } from '@app/ui/icons';
import { LogomarkIcon } from '@app/ui/icons/logomark-icon';

interface GetXpubLayoutProps {
  requester: string;
  onUserApproveGetXpub(): void;
}
export function GetXpubLayout(props: GetXpubLayoutProps) {
  const { requester, onUserApproveGetXpub } = props;

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
          <Button onClick={() => onUserApproveGetXpub()} fullWidth>
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
        bg="accent.background-secondary"
      >
        <styled.p textStyle="caption.02">
          By connecting you give permission to {requester} to view Xpub of this account
        </styled.p>
      </Flex>
    </Flex>
  );
}
