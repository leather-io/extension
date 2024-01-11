import { SwapSelectors } from '@tests/selectors/swap.selectors';
import { useField } from 'formik';
import { HStack, styled } from 'leather-styles/jsx';

import { Button } from '@app/ui/components/button/button';
import { ChevronDownIcon } from '@app/ui/components/icons/chevron-down-icon';

interface SelectAssetTriggerButtonProps {
  icon?: string;
  name: string;
  onChooseAsset(): void;
  symbol: string;
}
export function SelectAssetTriggerButton({
  icon,
  name,
  onChooseAsset,
  symbol,
}: SelectAssetTriggerButtonProps) {
  const [field] = useField(name);

  return (
    <Button
      data-testid={SwapSelectors.SelectAssetTriggerBtn}
      onClick={onChooseAsset}
      p="space.02"
      variant="ghost"
      {...field}
    >
      <HStack>
        {icon && <styled.img src={icon} width="32px" height="32px" alt="Swap asset" />}
        <styled.span textStyle="label.01">{symbol}</styled.span>
        <ChevronDownIcon />
      </HStack>
    </Button>
  );
}
