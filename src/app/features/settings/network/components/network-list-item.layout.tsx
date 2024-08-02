import { NetworkSelectors } from '@tests/selectors/network.selectors';
import { SettingsSelectors } from '@tests/selectors/settings.selectors';
import { Flex, HStack, Stack, styled } from 'leather-styles/jsx';

import type { NetworkConfiguration } from '@leather.io/models';
import { Button, CheckmarkIcon, CloudOffIcon } from '@leather.io/ui';

import { getUrlHostname, truncateString } from '@app/common/utils';

import { NetworkItemMenu } from './network-list-item-menu';

interface NetworkListItemLayoutProps {
  networkId: string;
  isOnline: boolean;
  isActive: boolean;
  isCustom: boolean;
  network: NetworkConfiguration;
  onSelectNetwork(): void;
  onEditNetwork(): void;
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
  onEditNetwork,
}: NetworkListItemLayoutProps) {
  const unselectable = !isOnline || isActive;
  return (
    <Flex data-testid={SettingsSelectors.NetworkListItem}>
      <Button
        width="100%"
        variant="ghost"
        key={networkId}
        _hover={
          unselectable
            ? undefined
            : {
                bg: 'ink.component-background-hover',
              }
        }
        px="space.05"
        py="space.04"
        onClick={unselectable ? undefined : onSelectNetwork}
        cursor={!isOnline ? 'not-allowed' : isActive ? 'default' : 'pointer'}
        opacity={!isOnline ? 0.5 : 1}
        data-testid={network.id}
        aria-disabled={unselectable}
      >
        <Flex width="100%" justifyContent="space-between" alignItems="center">
          <Stack alignItems="flex-start" flex={1} gap="space.02">
            <HStack alignItems="center" mb="1">
              <styled.span textStyle="label.01">{truncateString(network.name, 20)}</styled.span>
              {isActive && (
                <CheckmarkIcon
                  variant="small"
                  data-testid={NetworkSelectors.NetworkListActiveNetwork}
                />
              )}
            </HStack>

            <styled.span textStyle="caption.01">
              {getUrlHostname(network.chain.stacks.url)}
            </styled.span>
          </Stack>
          {!isOnline ? <CloudOffIcon /> : null}
          {isOnline && isCustom && (
            <NetworkItemMenu
              onClickDeleteNetwork={() => onRemoveNetwork(network.id)}
              onEditNetwork={onEditNetwork}
            />
          )}
        </Flex>
      </Button>
    </Flex>
  );
}
