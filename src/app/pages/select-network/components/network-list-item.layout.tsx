import { FiTrash2 } from 'react-icons/fi';

import { SettingsSelectors } from '@tests/selectors/settings.selectors';
import { Box, BoxProps, Flex, Stack } from 'leather-styles/jsx';
import { styled } from 'leather-styles/jsx';

import { NetworkConfiguration } from '@shared/constants';

import { getUrlHostname } from '@app/common/utils';
import { LeatherButton } from '@app/components/button/button';

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

// got rid of ...rest here as we never pass anything extra
export function NetworkListItemLayout({
  networkId,
  isOnline,
  isActive,
  network,
  isCustom,
  onRemoveNetwork,
  onSelectNetwork,
}: NetworkListItemLayoutProps) {
  return (
    <Box
      width="100%"
      key={networkId}
      _hover={
        !isOnline || isActive
          ? undefined
          : {
              backgroundColor: 'colors.brown.2', // check this
            }
      }
      px="loose"
      py="space.04"
      onClick={!isOnline || isActive ? undefined : onSelectNetwork}
      cursor={!isOnline ? 'not-allowed' : isActive ? 'default' : 'pointer'}
      opacity={!isOnline ? 0.5 : 1}
      data-testid={SettingsSelectors.NetworkListItem}
    >
      <Flex>
        <Flex
          width="100%"
          // as="button" // FIXME - need to sort out all these Flex as button stuff
          justifyContent="space-between"
          alignItems="center"
          // disabled={!isOnline} " // FIXME - need to sort out all these Flex as button stuff
          data-testid={network.id}
        >
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
          <LeatherButton
            type="button"
            variant="ghost"
            // mode="tertiary" // TODO - need to check this works and looks OK
            ml="space.04"
            onClick={(e: React.MouseEvent<HTMLElement>) => {
              e.stopPropagation();
              onRemoveNetwork(network.id);
            }}
          >
            <FiTrash2 size="14px" />
          </LeatherButton>
        )}
      </Flex>
    </Box>
  );
}
