import { Box, HStack, styled } from 'leather-styles/jsx';

import { Link } from '@leather.io/ui';
import { noop } from '@leather.io/utils';

import { BasicTooltip } from '@app/ui/components/tooltip/basic-tooltip';

import { SelectAssetTriggerButton } from './select-asset-trigger-button';
import { SwapAssetSelected } from './swap-asset-selected';
import { SwapToggleButton } from './swap-toggle-button';

function getTextColor(showError?: boolean, onClickHandler?: boolean) {
  if (showError) return 'red.action-primary-default';
  if (onClickHandler) return 'ink.text-primary';
  return 'ink.text-subdued';
}

interface SwapAssetSelectLayoutProps {
  caption?: string;
  error?: string;
  icon?: string;
  name: string;
  onSelectAsset(): void;
  onClickHandler?(): void;
  showError?: boolean;
  showToggle?: boolean;
  swapAmountInput: React.JSX.Element;
  symbol: string;
  title: string;
  tooltipLabel?: string;
  value: string;
}
export function SwapAssetSelectLayout({
  caption,
  error,
  icon,
  name,
  onSelectAsset,
  onClickHandler,
  showError,
  showToggle,
  swapAmountInput,
  symbol,
  title,
  tooltipLabel,
  value,
}: SwapAssetSelectLayoutProps) {
  const captionTextColor = getTextColor(showError);

  return (
    <Box width="100%">
      <HStack
        alignItems="center"
        justifyContent="space-between"
        mb="space.02"
        mt={showToggle ? 'space.06' : 'space.04'}
      >
        <styled.span textStyle="label.01">{title}</styled.span>
        {showToggle && <SwapToggleButton />}
      </HStack>
      <SwapAssetSelected
        contentLeft={
          <SelectAssetTriggerButton
            icon={icon}
            name={name}
            onSelectAsset={onSelectAsset}
            symbol={symbol}
          />
        }
        contentRight={swapAmountInput}
        name={name}
        showError={showError}
      />
      {caption ? (
        <HStack alignItems="center" justifyContent="space-between">
          <BasicTooltip label={tooltipLabel} side="bottom">
            <styled.span
              color={captionTextColor}
              cursor={tooltipLabel ? 'pointer' : 'unset'}
              textStyle="caption.01"
            >
              {showError ? error : caption}
            </styled.span>
          </BasicTooltip>
          <Link
            _focus={{ _before: { color: 'unset' } }}
            cursor={onClickHandler ? 'pointer' : 'unset'}
            onClick={onClickHandler ? onClickHandler : noop}
            variant={onClickHandler ? 'underlined' : 'text'}
          >
            <styled.span textStyle="caption.01">{value}</styled.span>
          </Link>
        </HStack>
      ) : null}
    </Box>
  );
}
