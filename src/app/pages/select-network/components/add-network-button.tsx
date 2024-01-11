import { SettingsSelectors } from '@tests/selectors/settings.selectors';
import { Flex } from 'leather-styles/jsx';

import { Button } from '@app/ui/components/button/button';

interface AddNetworkButtonProps {
  onAddNetwork(): void;
}
export function AddNetworkButton({ onAddNetwork }: AddNetworkButtonProps) {
  return (
    <Flex py="space.05" px="space.05" flexGrow="1">
      <Button data-testid={SettingsSelectors.BtnAddNetwork} fullWidth onClick={onAddNetwork}>
        Add a network
      </Button>
    </Flex>
  );
}
