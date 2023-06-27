import { FiArrowUpRight, FiCopy } from 'react-icons/fi';

import { Box, Stack, Text, color, useClipboard } from '@stacks/ui';

import { BtcIcon } from '@app/components/icons/btc-icon';
import { Flag } from '@app/components/layout/flag';
import { SpaceBetween } from '@app/components/layout/space-between';
import { Tooltip } from '@app/components/tooltip';

interface BitcoinContractLockAmountProps {
  hoverLabel?: string;
  image?: JSX.Element;
  subtitle?: string;
  subValue?: string;
  subValueAction?(): void;
  title?: string;
  value: string;
}
export function BitcoinContractLockAmount({
  hoverLabel,
  image,
  subtitle,
  subValue,
  subValueAction,
  title,
  value,
}: BitcoinContractLockAmountProps) {
  const { onCopy, hasCopied } = useClipboard(hoverLabel ?? '');

  return (
    <Flag align="middle" img={image || <BtcIcon />} my="loose" spacing="base">
      <SpaceBetween>
        <Text fontSize={2} fontWeight="500">
          {title ? title : 'BTC'}
        </Text>
        <Text fontSize={2} fontWeight="500">
          {value}
        </Text>
      </SpaceBetween>
      <SpaceBetween mt="tight">
        {subtitle ? (
          <Tooltip
            disabled={!hoverLabel}
            hideOnClick={false}
            label={hasCopied ? 'Copied!' : hoverLabel}
            labelProps={{ wordWrap: 'break-word' }}
            maxWidth="230px"
            placement="bottom"
          >
            <Box
              _hover={{ cursor: 'pointer' }}
              as="button"
              color={color('text-caption')}
              display="flex"
              onClick={onCopy}
              type="button"
            >
              <Text color={color('text-caption')} fontSize={1} mr="extra-tight">
                {subtitle}
              </Text>
              {hoverLabel ? <FiCopy size="14px" /> : null}
            </Box>
          </Tooltip>
        ) : null}
        {subValue ? (
          <Stack as="button" isInline onClick={subValueAction} spacing="extra-tight" type="button">
            <Text color={subValueAction ? color('accent') : color('text-caption')} fontSize={1}>
              {subValue}
            </Text>
            {subValueAction ? <FiArrowUpRight color={color('accent')} /> : null}
          </Stack>
        ) : null}
      </SpaceBetween>
    </Flag>
  );
}
