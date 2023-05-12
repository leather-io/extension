import { FiTrash2 } from 'react-icons/fi';

import { Box, BoxProps, Button, Flex, Stack, color } from '@stacks/ui';
import { SettingsSelectors } from '@tests-legacy/integration/settings.selectors';

import { NetworkConfiguration } from '@shared/constants';

import { getUrlHostname } from '@app/common/utils';
import { Caption, Title } from '@app/components/typography';

import { NetworkStatusIndicator } from './network-status-indicator';

interface NetworkListItemLayoutProps extends BoxProps {
  networkId: string;
  isOnline: boolean;
  isActive: boolean;
  isCustom: boolean;
  network: NetworkConfiguration;
  onSelectNetwork(): void;
  onRemoveNetwork(id: string): void;
}
export function NetworkListItemLayout(props: NetworkListItemLayoutProps) {
  const {
    networkId,
    isOnline,
    isActive,
    network,
    isCustom,
    onRemoveNetwork,
    onSelectNetwork,
    ...rest
  } = props;

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
      <Flex>
        <Flex
          width="100%"
          as="button"
          justifyContent="space-between"
          alignItems="center"
          disabled={!isOnline}
          data-testid={network.id}
        >
          <Stack alignItems="flex-start" flex={1}>
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
        {isCustom && (
          <Button
            type="button"
            mode="tertiary"
            ml="base"
            onClick={e => {
              e.stopPropagation();
              onRemoveNetwork(network.id);
            }}
          >
            <FiTrash2 size="14px" />
          </Button>
        )}
      </Flex>
    </Box>
  );
}
