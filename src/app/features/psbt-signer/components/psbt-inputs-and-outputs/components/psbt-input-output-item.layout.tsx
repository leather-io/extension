import { Box, Flex, HStack, styled } from 'leather-styles/jsx';

import { useClipboard } from '@app/common/hooks/use-copy-to-clipboard';
import { useExplorerLink } from '@app/common/hooks/use-explorer-link';
import { LeatherButton } from '@app/components/button/button';
import { CopyIcon } from '@app/components/icons/copy-icon';
import { Flag } from '@app/components/layout/flag';
import { Tooltip } from '@app/components/tooltip';

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
  const { handleOpenTxLink } = useExplorerLink();

  return (
    <Flag align="middle" img={<></>} mt="loose" spacing="base">
      <HStack alignItems="center" justifyContent="space-between">
        <Flex alignItems="center">
          <styled.span mr="space.02" textStyle="caption.01">
            {address}
          </styled.span>
          <Tooltip
            disabled={!addressHoverLabel}
            hideOnClick={false}
            label={hasCopied ? 'Copied!' : addressHoverLabel}
            labelProps={{ wordWrap: 'break-word' }}
            maxWidth="230px"
            placement="bottom"
          >
            <Box display="flex" height="16px">
              <LeatherButton onClick={onCopy} variant="text">
                {addressHoverLabel ? <CopyIcon /> : null}
              </LeatherButton>
            </Box>
          </Tooltip>
          {label}
        </Flex>
        <styled.span textStyle="caption.01">{amount}</styled.span>
      </HStack>
      <Box mt="space.01">
        {txId && txIdHoverLabel ? (
          <LeatherButton
            onClick={() =>
              handleOpenTxLink({
                blockchain: 'bitcoin',
                txId: txIdHoverLabel ?? '',
              })
            }
            variant="text"
          >
            <Tooltip
              disabled={!txIdHoverLabel}
              hideOnClick={false}
              label={txIdHoverLabel}
              labelProps={{ wordWrap: 'break-word' }}
              maxWidth="230px"
              placement="bottom"
            >
              <styled.span textStyle="caption.02">{txId}</styled.span>
            </Tooltip>
          </LeatherButton>
        ) : null}
      </Box>
    </Flag>
  );
}
