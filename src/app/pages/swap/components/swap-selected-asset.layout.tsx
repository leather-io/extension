import { FiChevronDown, FiInfo } from 'react-icons/fi';

import { Box, Stack, Text, color } from '@stacks/ui';

import { noop } from '@shared/utils';

import { SpaceBetween } from '@app/components/layout/space-between';
import { Tooltip } from '@app/components/tooltip';

import { SelectedAssetField } from './selected-asset-field';
import { SwapToggleButton } from './swap-toggle-button';

function getTextColor(showError?: boolean, onClickHandler?: boolean) {
  if (showError) return color('feedback-error');
  if (onClickHandler) return color('accent');
  return color('text-caption');
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
      <SpaceBetween mb="tight" mt="base">
        <Text fontWeight={500}>{title}</Text>
        {showToggle && <SwapToggleButton />}
      </SpaceBetween>
      <SelectedAssetField
        contentLeft={
          <Stack
            alignItems="center"
            as="button"
            isInline
            onClick={onChooseAsset}
            spacing="tight"
            type="button"
            width="50%"
          >
            <Text>{symbol}</Text>
            <FiChevronDown />
          </Stack>
        }
        contentRight={swapAmountInput}
        icon={icon}
        name={name}
      />
      {caption ? (
        <SpaceBetween>
          <Stack alignItems="center" isInline spacing="extra-tight">
            <Text color={captionTextColor} fontSize={0}>
              {error ?? caption}
            </Text>
            {tooltipLabel ? (
              <Tooltip label={tooltipLabel} maxWidth="160px" placement="bottom">
                <Stack>
                  <Box
                    _hover={{ cursor: 'pointer' }}
                    as={FiInfo}
                    color={captionTextColor}
                    ml="2px"
                    size="14px"
                  />
                </Stack>
              </Tooltip>
            ) : null}
          </Stack>
          <Text
            as="button"
            color={getTextColor(showError, !!onClickHandler)}
            fontSize={0}
            fontWeight={500}
            onClick={!showError && onClickHandler ? onClickHandler : noop}
            type="button"
          >
            {value}
          </Text>
        </SpaceBetween>
      ) : null}
    </Box>
  );
}
