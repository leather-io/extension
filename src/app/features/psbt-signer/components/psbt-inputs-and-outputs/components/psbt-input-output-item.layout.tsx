import { Box, Flex, HStack, styled } from 'leather-styles/jsx';

import { useBitcoinExplorerLink } from '@app/common/hooks/use-bitcoin-explorer-link';
import { useClipboard } from '@app/common/hooks/use-copy-to-clipboard';
import { Flag } from '@app/components/layout/flag';
import { CopyIcon } from '@app/ui/components/icons/copy-icon';
import { Link } from '@app/ui/components/link/link';
import { BasicTooltip } from '@app/ui/components/tooltip/basic-tooltip';

interface PsbtInputOutputItemLayoutProps {
  address: string;
  addressHoverLabel?: string;
  amount: string;
  label?: React.JSX.Element;
  txId?: string;
  txIdHoverLabel?: string;
}
export function PsbtInputOutputItemLayout({
  address,
  addressHoverLabel,
  amount,
  label,
  txId,
  txIdHoverLabel,
}: PsbtInputOutputItemLayoutProps) {
  const { onCopy, hasCopied } = useClipboard(addressHoverLabel ?? '');
  const { handleOpenBitcoinTxLink: handleOpenTxLink } = useBitcoinExplorerLink();

  return (
    <Flag align="middle" img={<></>} mt="space.05" spacing="space.04">
      <HStack alignItems="center" justifyContent="space-between">
        <Flex alignItems="center">
          <styled.span mr="space.02" textStyle="caption.01">
            {address}
          </styled.span>
          <BasicTooltip
            disabled={!addressHoverLabel}
            label={hasCopied ? 'Copied!' : addressHoverLabel}
            side="bottom"
          >
            <Box display="flex" height="16px">
              <Link onClick={onCopy} variant="text">
                {addressHoverLabel ? <CopyIcon /> : null}
              </Link>
            </Box>
          </BasicTooltip>
          {label}
        </Flex>
        <styled.span textStyle="caption.01">{amount}</styled.span>
      </HStack>
      <Box mt="space.01">
        {txId && txIdHoverLabel ? (
          <Link
            onClick={() =>
              handleOpenTxLink({
                txid: txIdHoverLabel ?? '',
              })
            }
            variant="text"
          >
            <BasicTooltip disabled={!txIdHoverLabel} label={txIdHoverLabel} side="bottom">
              <styled.span textStyle="caption.02">{txId}</styled.span>
            </BasicTooltip>
          </Link>
        ) : null}
      </Box>
    </Flag>
  );
}
