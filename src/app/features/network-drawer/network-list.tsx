import { Flex, FlexProps } from '@stacks/ui';
import { useWallet } from '@app/common/hooks/use-wallet';
import { NetworkListItem } from '@app/features/network-drawer/network-list-item';
import { SettingsSelectors } from '@tests/integration/settings.selectors';

export const NetworkList = (props: FlexProps) => {
  const { networks } = useWallet();
  const networkIds = Object.keys(networks);

  return (
    <Flex flexWrap="wrap" flexDirection="column" {...props}>
      {networkIds.map(id => (
        <NetworkListItem key={id} data-testid={SettingsSelectors.NetworkListItem} networkId={id} />
      ))}
    </Flex>
  );
};
