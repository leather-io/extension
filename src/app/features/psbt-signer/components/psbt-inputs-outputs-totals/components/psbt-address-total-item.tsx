import { Box, HStack, styled } from 'leather-styles/jsx';

import { BtcAvatarIcon, CopyIcon, Flag, Link } from '@leather.io/ui';

import { useClipboard } from '@app/common/hooks/use-copy-to-clipboard';
import { BasicTooltip } from '@app/ui/components/tooltip/basic-tooltip';

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
    <Flag img={image ? image : <BtcAvatarIcon />} mt="space.05" spacing="space.04">
      <HStack alignItems="center" justifyContent="space-between">
        <styled.span textStyle="label.01">{title ? title : 'Bitcoin'}</styled.span>
        {valueAction ? (
          <Link onClick={valueAction}>{value}</Link>
        ) : (
          <styled.span textStyle="label.01">{value}</styled.span>
        )}
      </HStack>
      <HStack alignItems="center" justifyContent="space-between">
        {subtitle ? (
          <HStack gap="space.01">
            <styled.span mr="space.01" textStyle="caption.01">
              {subtitle}
            </styled.span>
            <BasicTooltip
              disabled={!hoverLabel}
              label={hasCopied ? 'Copied!' : hoverLabel}
              side="bottom"
            >
              <Box display="flex">
                <Link onClick={onCopy} variant="text">
                  {hoverLabel ? <CopyIcon /> : null}
                </Link>
              </Box>
            </BasicTooltip>
          </HStack>
        ) : null}
        {subValue ? (
          <styled.span mr="space.01" textStyle="caption.01">
            {subValue}
          </styled.span>
        ) : null}
      </HStack>
    </Flag>
  );
}
