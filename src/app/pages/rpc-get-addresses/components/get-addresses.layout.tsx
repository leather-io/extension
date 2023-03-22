import ConnectionIllustration from '@assets/images/connect-arrows-facing-each-other.svg';
import HiroLogoInBox from '@assets/images/hiro-logo-white-box.png';
import { Box, Button, Flex, Text } from '@stacks/ui';

import { figmaTheme } from '@app/common/utils/figma-theme';
import { Favicon } from '@app/components/favicon';
import { Flag } from '@app/components/layout/flag';
import { Caption } from '@app/components/typography';

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
        justifyContent="center"
        textAlign="center"
        alignItems="center"
        mx="extra-loose"
      >
        <Box mt="extra-loose">
          <img src={ConnectionIllustration} width="132" />
        </Box>
        <Text as="h1" mt="base" fontSize="24px" fontWeight={500} lineHeight="36px">
          Connect your account to {requester}
        </Text>
        <Flag img={<Favicon origin={requester} />} mt="base">
          <Caption>{requester}</Caption>
        </Flag>

        <Button mt="extra-loose" onClick={() => onUserApproveGetAddresses()} width="100%">
          <Flag align="middle" img={<img src={HiroLogoInBox} width="16px" />}>
            Connect to Hiro Wallet
          </Flag>
        </Button>
      </Flex>
      <Flex
        backgroundColor={figmaTheme.backgroundSubdued}
        px="loose"
        py="base"
        lineHeight="20px"
        textAlign="center"
        alignSelf="bottom"
      >
        <Text fontSize="14px" color={figmaTheme.textSubdued}>
          By connecting you give permission to {requester} to see all addresses linked to this
          account
        </Text>
      </Flex>
    </Flex>
  );
}
