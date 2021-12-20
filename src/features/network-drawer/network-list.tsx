import { Flex, FlexProps } from '@stacks/ui';
import { useWallet } from '@common/hooks/use-wallet';
import { NetworkListItem } from '@features/network-drawer/network-list-item';
import { SettingsSelectors } from '@tests/integration/settings.selectors';

export const NetworkList = (props: FlexProps) => {
  const { networks } = useWallet();
  const items = Object.keys(networks);
  return (
    <Flex flexWrap="wrap" flexDirection="column" {...props}>
      {items.map(item => (
        <NetworkListItem key={item} data-testid={SettingsSelectors.NetworkListItem} item={item} />
      ))}
    </Flex>
  );
};
