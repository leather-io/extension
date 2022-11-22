import { Box, BoxProps, Flex, Stack, color } from '@stacks/ui';
import { SettingsSelectors } from '@tests-legacy/integration/settings.selectors';

import { NetworkConfiguration } from '@shared/constants';

import { getUrlHostname } from '@app/common/utils';
import { Caption, Title } from '@app/components/typography';

import { NetworkStatusIndicator } from './network-status-indicator';

interface NetworkListItemLayoutProps extends BoxProps {
  networkId: string;
  isOnline: boolean;
  isActive: boolean;
  network: NetworkConfiguration;
  onSelectNetwork(): void;
}
export function NetworkListItemLayout(props: NetworkListItemLayoutProps) {
  const { networkId, isOnline, isActive, network, onSelectNetwork, ...rest } = props;

  return (
    <Box
      width="100%"
      key={networkId}
      _hover={
        !isOnline || isActive
          ? undefined
          : {
              backgroundColor: color('bg-4'),
            }
      }
      px="loose"
      py="base"
      onClick={!isOnline || isActive ? undefined : onSelectNetwork}
      cursor={!isOnline ? 'not-allowed' : isActive ? 'default' : 'pointer'}
      opacity={!isOnline ? 0.5 : 1}
      data-testid={SettingsSelectors.NetworkListItem}
      {...rest}
    >
      <Flex width="100%" justifyContent="space-between" alignItems="center">
        <Stack>
          <Title
            fontWeight={400}
            lineHeight="1rem"
            fontSize={2}
            display="block"
            fontFamily="'Inter'"
          >
            {network.name}
          </Title>
          <Caption>{getUrlHostname(network.chain.stacks.url)}</Caption>
        </Stack>
        <NetworkStatusIndicator isActive={isActive} isOnline={isOnline} />
      </Flex>
    </Box>
  );
}
