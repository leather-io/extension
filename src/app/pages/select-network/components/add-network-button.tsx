import { SettingsSelectors } from '@tests/selectors/settings.selectors';
import { BoxProps, Flex } from 'leather-styles/jsx';

import { LeatherButton } from '@app/components/button/button';

// FIXME move this into tokens
export declare type ButtonSizes = 'sm' | 'md' | 'lg';
export declare type ButtonVariants = 'link' | 'solid';
export declare type ButtonModes = 'primary' | 'secondary' | 'tertiary';
export interface ButtonProps extends Omit<BoxProps, 'size'> {
  variant?: ButtonVariants;
  mode?: ButtonModes;
  isDisabled?: boolean;
  loadingText?: string;
  isLoading?: boolean;
  size?: ButtonSizes;
}

interface AddNetworkButtonProps extends ButtonProps {
  onAddNetwork(): void;
}
export function AddNetworkButton({ onAddNetwork }: AddNetworkButtonProps) {
  return (
    <Flex py="space.05" px="space.05" flexGrow="1">
      <LeatherButton data-testid={SettingsSelectors.BtnAddNetwork} fullWidth onClick={onAddNetwork}>
        Add a network
      </LeatherButton>
    </Flex>
  );
}
