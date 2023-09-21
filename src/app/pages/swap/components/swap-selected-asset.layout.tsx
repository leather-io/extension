import { Box, HStack, styled } from 'leather-styles/jsx';

import { noop } from '@shared/utils';

import { LeatherButton } from '@app/components/button/button';
import { ChevronDownIcon } from '@app/components/icons/chevron-down-icon';
import { InfoIcon } from '@app/components/icons/info-icon';
import { SpaceBetween } from '@app/components/layout/space-between';
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
      <SpaceBetween mb="tight" mt={showToggle ? 'extra-loose' : 'base'}>
        <styled.span textStyle="label.01">{title}</styled.span>
        {showToggle && <SwapToggleButton />}
      </SpaceBetween>
      <SelectedAssetField
        contentLeft={
          <styled.button onClick={onChooseAsset} pr="space.02" py="space.02" type="button">
            <HStack>
              <styled.span textStyle="label.01">{symbol}</styled.span>
              <ChevronDownIcon />
            </HStack>
          </styled.button>
        }
        contentRight={swapAmountInput}
        icon={icon}
        name={name}
      />
      {caption ? (
        <SpaceBetween>
          <HStack alignItems="center" gap="space.01">
            <styled.span color={captionTextColor} textStyle="caption.02">
              {error ?? caption}
            </styled.span>
            {tooltipLabel ? (
              <Tooltip label={tooltipLabel} maxWidth="160px" placement="bottom">
                <Box _hover={{ cursor: 'pointer' }} color={captionTextColor}>
                  <InfoIcon />
                </Box>
              </Tooltip>
            ) : null}
          </HStack>
          <LeatherButton
            onClick={!showError && onClickHandler ? onClickHandler : noop}
            variant={onClickHandler ? 'link' : 'text'}
          >
            <styled.span color={captionTextColor} textStyle="caption.02">
              {value}
            </styled.span>
          </LeatherButton>
        </SpaceBetween>
      ) : null}
    </Box>
  );
}
