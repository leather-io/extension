import { SettingsSelectors } from '@tests/selectors/settings.selectors';
import { Box, Flex, Stack, styled } from 'leather-styles/jsx';

import { NetworkConfiguration } from '@shared/constants';

import { getUrlHostname } from '@app/common/utils';
import { Button } from '@app/ui/components/button/button';
import { TrashIcon } from '@app/ui/components/icons/trash-icon';

import { NetworkStatusIndicator } from './network-status-indicator';

interface NetworkListItemLayoutProps {
  networkId: string;
  isOnline: boolean;
  isActive: boolean;
  isCustom: boolean;
  network: NetworkConfiguration;
  onSelectNetwork(): void;
  onRemoveNetwork(id: string): void;
}
export function NetworkListItemLayout({
  networkId,
  isOnline,
  isActive,
  network,
  isCustom,
  onRemoveNetwork,
  onSelectNetwork,
}: NetworkListItemLayoutProps) {
  const unSelectable = !isOnline || isActive;
  return (
    <Flex data-testid={SettingsSelectors.NetworkListItem}>
      <Box
        width="100%"
        key={networkId}
        _hover={
          unSelectable
            ? undefined
            : {
                backgroundColor: 'accent.component-background-hover',
              }
        }
        px="space.05"
        py="space.04"
        onClick={unSelectable ? undefined : onSelectNetwork}
        cursor={!isOnline ? 'not-allowed' : isActive ? 'default' : 'pointer'}
        opacity={!isOnline ? 0.5 : 1}
        data-testid={network.id}
      >
        <Flex width="100%" justifyContent="space-between" alignItems="center">
          <Stack alignItems="flex-start" flex={1} gap="space.02">
            <styled.span mb="space.01" textStyle="label.01">
              {network.name}
            </styled.span>
            <styled.span textStyle="caption.01">
              {getUrlHostname(network.chain.stacks.url)}
            </styled.span>
          </Stack>
          <NetworkStatusIndicator isActive={isActive} isOnline={isOnline} />
        </Flex>
        {isCustom && (
          <Button
            type="button"
            ml="space.04"
            onClick={e => {
              e.stopPropagation();
              onRemoveNetwork(network.id);
            }}
          >
            <TrashIcon />
          </Button>
        )}
      </Box>
    </Flex>
  );
}
