import { Button, ButtonProps } from '@stacks/ui';
import { SettingsSelectors } from '@tests-legacy/integration/settings.selectors';

interface AddNetworkButtonProps extends ButtonProps {
  onAddNetwork(): void;
}
export function AddNetworkButton({ onAddNetwork }: AddNetworkButtonProps) {
  return (
    <Button
      alignSelf="flex-start"
      mt="base"
      mb="loose"
      mx="loose"
      borderRadius="10px"
      onClick={onAddNetwork}
      data-testid={SettingsSelectors.BtnAddNetwork}
    >
      Add a network
    </Button>
  );
}
