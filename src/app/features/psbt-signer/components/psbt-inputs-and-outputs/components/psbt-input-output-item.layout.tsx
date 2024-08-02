import { Box, Flex, HStack, styled } from 'leather-styles/jsx';

import { CopyIcon, Flag, Link } from '@leather.io/ui';

import { useBitcoinExplorerLink } from '@app/common/hooks/use-bitcoin-explorer-link';
import { useClipboard } from '@app/common/hooks/use-copy-to-clipboard';
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
    <Flag img={<></>} mt="space.05" spacing="space.04">
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
            <Box display="flex">
              <styled.button _hover={{ bg: 'ink.component-background-hover' }} onClick={onCopy}>
                {addressHoverLabel ? <CopyIcon variant="small" /> : null}
              </styled.button>
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
              <styled.span textStyle="caption.01">{txId}</styled.span>
            </BasicTooltip>
          </Link>
        ) : null}
      </Box>
    </Flag>
  );
}
