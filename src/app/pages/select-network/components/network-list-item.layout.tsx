import { FiTrash2 } from 'react-icons/fi';

import { SettingsSelectors } from '@tests/selectors/settings.selectors';
import { Box, BoxProps, Flex, Stack } from 'leather-styles/jsx';
import { styled } from 'leather-styles/jsx';
import { token } from 'leather-styles/tokens';

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
              backgroundColor: token('colors.brown.2'),
            }
      }
      px="space.05"
      py="space.04"
      onClick={!isOnline || isActive ? undefined : onSelectNetwork}
      cursor={!isOnline ? 'not-allowed' : isActive ? 'default' : 'pointer'}
      opacity={!isOnline ? 0.5 : 1}
      data-testid={SettingsSelectors.NetworkListItem}
      {...rest}
    >
      <Flex>
        {/* // FIXME this should just be a button or leather button */}
        <styled.button
          width="100%"
          // as="button"
          justifyContent="space-between"
          alignItems="center"
          disabled={!isOnline}
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
        </styled.button>
        {isCustom && (
          <LeatherButton
            type="button"
            // #4164 FIXME migrate tertiary
            variant="ghost"
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
