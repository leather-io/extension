import { CheckmarkIcon, CloudOffIcon, TrashIcon } from '@leather-wallet/ui';
import { Button } from '@leather-wallet/ui';
import { NetworkSelectors } from '@tests/selectors/network.selectors';
import { SettingsSelectors } from '@tests/selectors/settings.selectors';
import { Flex, Stack, styled } from 'leather-styles/jsx';

import { NetworkConfiguration } from '@shared/constants';

import { getUrlHostname } from '@app/common/utils';

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
            <styled.span mb="space.01" textStyle="label.01">
              {network.name}
            </styled.span>
            <styled.span textStyle="caption.01">
              {getUrlHostname(network.chain.stacks.url)}
            </styled.span>
          </Stack>
          {!isOnline ? (
            <CloudOffIcon />
          ) : isActive ? (
            <CheckmarkIcon data-testid={NetworkSelectors.NetworkListActiveNetwork} />
          ) : null}
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
      </Button>
    </Flex>
  );
}
