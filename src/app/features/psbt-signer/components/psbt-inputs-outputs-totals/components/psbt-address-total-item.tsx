import { FiCopy } from 'react-icons/fi';

import { Box, Text, color, useClipboard } from '@stacks/ui';

import { BtcIcon } from '@app/components/icons/btc-icon';
import { Flag } from '@app/components/layout/flag';
import { SpaceBetween } from '@app/components/layout/space-between';
import { Tooltip } from '@app/components/tooltip';

interface PsbtAddressTotalItemProps {
  hoverLabel?: string;
  image?: React.JSX.Element;
  subtitle?: string;
  subValue?: string;
  title?: string;
  value: string;
  valueAction?(): void;
}
export function PsbtAddressTotalItem({
  hoverLabel,
  image,
  subtitle,
  subValue,
  title,
  value,
  valueAction,
}: PsbtAddressTotalItemProps) {
  const { onCopy, hasCopied } = useClipboard(hoverLabel ?? '');

  return (
    <Flag align="middle" img={image ? image : <BtcIcon />} mt="loose" spacing="base">
      <SpaceBetween>
        <Text fontSize={2} fontWeight="500">
          {title ? title : 'Bitcoin'}
        </Text>
        <Box as="button" onClick={valueAction} type="button">
          <Text color={valueAction ? color('accent') : 'unset'} fontSize={2} fontWeight={500}>
            {value}
          </Text>
        </Box>
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
          <Text color={color('text-caption')} fontSize={1}>
            {subValue}
          </Text>
        ) : null}
      </SpaceBetween>
    </Flag>
  );
}
