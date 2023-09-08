// #4164 FIXME migrate useClipboard
import { useClipboard } from '@stacks/ui';
import { Box, HStack, styled } from 'leather-styles/jsx';

import { LeatherButton } from '@app/components/button/button';
import { BtcIcon } from '@app/components/icons/btc-icon';
import { CopyIcon } from '@app/components/icons/copy-icon';
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
    <Flag align="middle" img={image ? image : <BtcIcon />} mt="space.05" spacing="space.04">
      <SpaceBetween>
        <styled.span textStyle="label.01">{title ? title : 'Bitcoin'}</styled.span>
        {valueAction ? (
          <LeatherButton onClick={valueAction} variant="link">
            {value}
          </LeatherButton>
        ) : (
          <styled.span textStyle="label.01">{value}</styled.span>
        )}
      </SpaceBetween>
      <SpaceBetween mt="space.02">
        {subtitle ? (
          <HStack gap="space.01">
            <styled.span mr="space.01" textStyle="caption.01">
              {subtitle}
            </styled.span>
            <Tooltip
              disabled={!hoverLabel}
              hideOnClick={false}
              label={hasCopied ? 'Copied!' : hoverLabel}
              labelProps={{ wordWrap: 'break-word' }}
              maxWidth="230px"
              placement="bottom"
            >
              <Box display="flex" height="16px">
                <LeatherButton onClick={onCopy} variant="text">
                  {hoverLabel ? <CopyIcon /> : null}
                </LeatherButton>
              </Box>
            </Tooltip>
          </HStack>
        ) : null}
        {subValue ? (
          <styled.span mr="space.01" textStyle="caption.01">
            {subValue}
          </styled.span>
        ) : null}
      </SpaceBetween>
    </Flag>
  );
}
