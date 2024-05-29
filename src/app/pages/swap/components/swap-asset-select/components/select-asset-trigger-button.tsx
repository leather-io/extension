import {
  Avatar,
  Button,
  ChevronDownIcon,
  defaultFallbackDelay,
  getAvatarFallback,
} from '@leather-wallet/ui';
import { SwapSelectors } from '@tests/selectors/swap.selectors';
import { useField } from 'formik';
import { HStack, styled } from 'leather-styles/jsx';

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
