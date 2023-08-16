import { Flex } from '@radix-ui/themes';
import { ButtonProps } from '@stacks/ui';
import { SettingsSelectors } from '@tests-legacy/integration/settings.selectors';

import { LeatherButton } from '@app/components/button/button';

interface AddNetworkButtonProps extends ButtonProps {
  onAddNetwork(): void;
}
export function AddNetworkButton({ onAddNetwork }: AddNetworkButtonProps) {
  return (
    <Flex pt="5" pb="5" px="5" grow="1">
      <LeatherButton data-testid={SettingsSelectors.BtnAddNetwork} fullWidth onClick={onAddNetwork}>
        Add a network
      </LeatherButton>
    </Flex>
  );
}
