import { Box, HStack, styled } from 'leather-styles/jsx';

import { noop } from '@shared/utils';

import { LeatherButton } from '@app/components/button/button';
import { ChevronDownIcon } from '@app/components/icons/chevron-down-icon';
import { Tooltip } from '@app/components/tooltip';

import { SelectedAssetField } from './selected-asset-field';
import { SwapToggleButton } from './swap-toggle-button';

function getTextColor(showError?: boolean, onClickHandler?: boolean) {
  if (showError) return 'error';
  if (onClickHandler) return 'accent.text-primary';
  return 'accent.text-subdued';
}

interface SwapSelectedAssetLayoutProps {
  caption?: string;
  error?: string;
  icon?: string;
  name: string;
  onChooseAsset(): void;
  onClickHandler?(): void;
  showError?: boolean;
  showToggle?: boolean;
  swapAmountInput: React.JSX.Element;
  symbol: string;
  title: string;
  tooltipLabel?: string;
  value: string;
}
export function SwapSelectedAssetLayout({
  caption,
  error,
  icon,
  name,
  onChooseAsset,
  onClickHandler,
  showError,
  showToggle,
  swapAmountInput,
  symbol,
  title,
  tooltipLabel,
  value,
}: SwapSelectedAssetLayoutProps) {
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
      <SelectedAssetField
        contentLeft={
          <LeatherButton onClick={onChooseAsset} p="space.02" type="button" variant="ghost">
            <HStack>
              {icon && <styled.img src={icon} width="32px" height="32px" alt="Swap asset" />}
              <styled.span textStyle="label.01">{symbol}</styled.span>
              <ChevronDownIcon />
            </HStack>
          </LeatherButton>
        }
        contentRight={swapAmountInput}
        name={name}
        showError={showError}
      />
      {caption ? (
        <HStack alignItems="center" justifyContent="space-between">
          <Tooltip label={tooltipLabel} maxWidth="160px" placement="bottom">
            <styled.span
              color={captionTextColor}
              cursor={tooltipLabel ? 'pointer' : 'unset'}
              textStyle="caption.02"
            >
              {showError ? error : caption}
            </styled.span>
          </Tooltip>
          <LeatherButton
            _focus={{ _before: { color: 'unset' } }}
            cursor={onClickHandler ? 'pointer' : 'unset'}
            onClick={onClickHandler ? onClickHandler : noop}
            type="button"
            variant={onClickHandler ? 'link' : 'text'}
          >
            <styled.span textStyle="caption.02">{value}</styled.span>
          </LeatherButton>
        </HStack>
      ) : null}
    </Box>
  );
}
