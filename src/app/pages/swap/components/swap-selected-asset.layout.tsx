import { FiInfo } from 'react-icons/fi';

import { Box, Stack, Text, color } from '@stacks/ui';
import { useField } from 'formik';

import { noop } from '@shared/utils';

import { useShowFieldError } from '@app/common/form-utils';
import { HasChildren } from '@app/common/has-children';
import { SpaceBetween } from '@app/components/layout/space-between';
import { Tooltip } from '@app/components/tooltip';

interface SwapSelectedAssetLayoutProps extends HasChildren {
  caption?: string;
  onClickHandler?(): void;
  title: string;
  tooltipLabel?: string;
  value: string;
}
export function SwapSelectedAssetLayout({
  caption,
  children,
  onClickHandler,
  title,
  tooltipLabel,
  value,
}: SwapSelectedAssetLayoutProps) {
  const [, meta] = useField('swapAmountFrom');
  const showError = useShowFieldError('swapAmountFrom');

  return (
    <Box width="100%">
      <Text fontWeight={500} mb="base-tight">
        {title}
      </Text>
      {children}
      {caption ? (
        <SpaceBetween>
          <Stack alignItems="center" isInline spacing="extra-tight">
            <Text color={showError ? color('feedback-error') : color('text-caption')} fontSize={0}>
              {meta.error ?? caption}
            </Text>
            {tooltipLabel ? (
              <Tooltip label={tooltipLabel} maxWidth="160px" placement="bottom">
                <Stack>
                  <Box
                    _hover={{ cursor: 'pointer' }}
                    as={FiInfo}
                    color={color('text-caption')}
                    ml="2px"
                    size="14px"
                  />
                </Stack>
              </Tooltip>
            ) : null}
          </Stack>
          <Text
            as="button"
            color={
              showError
                ? color('feedback-error')
                : onClickHandler
                ? color('accent')
                : color('text-caption')
            }
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
