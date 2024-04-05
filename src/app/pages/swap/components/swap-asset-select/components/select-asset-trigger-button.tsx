import { SwapSelectors } from '@tests/selectors/swap.selectors';
import { useField } from 'formik';
import { HStack, styled } from 'leather-styles/jsx';

import { Avatar, defaultFallbackDelay, getAvatarFallback } from '@app/ui/components/avatar/avatar';
import { Button } from '@app/ui/components/button/button';
import { ChevronDownIcon } from '@app/ui/icons/chevron-down-icon';

interface SelectAssetTriggerButtonProps {
  icon?: string;
  name: string;
  onSelectAsset(): void;
  symbol: string;
}
export function SelectAssetTriggerButton({
  icon,
  name,
  onSelectAsset,
  symbol,
}: SelectAssetTriggerButtonProps) {
  const [field] = useField(name);
  const fallback = getAvatarFallback(symbol);

  return (
    <Button
      data-testid={SwapSelectors.SelectAssetTriggerBtn}
      onClick={onSelectAsset}
      p="space.02"
      variant="ghost"
      {...field}
    >
      <HStack>
        {icon && (
          <Avatar.Root>
            <Avatar.Image alt={fallback} src={icon} />
            <Avatar.Fallback delayMs={defaultFallbackDelay}>{fallback}</Avatar.Fallback>
          </Avatar.Root>
        )}
        <styled.span textStyle="label.01">{symbol}</styled.span>
        <ChevronDownIcon variant="small" />
      </HStack>
    </Button>
  );
}
