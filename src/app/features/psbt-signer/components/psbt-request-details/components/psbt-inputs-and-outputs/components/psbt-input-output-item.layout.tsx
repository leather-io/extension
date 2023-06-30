import { FiCopy } from 'react-icons/fi';

import { Box, Flex, Text, color, useClipboard } from '@stacks/ui';

import { useExplorerLink } from '@app/common/hooks/use-explorer-link';
import { Flag } from '@app/components/layout/flag';
import { SpaceBetween } from '@app/components/layout/space-between';
import { Link } from '@app/components/link';
import { Tooltip } from '@app/components/tooltip';

interface PsbtInputOutputItemLayoutProps {
  address: string;
  addressHoverLabel?: string;
  amount: string;
  pillHoverLabel?: string;
  pillLabel?: React.JSX.Element;
  txId?: string;
  txIdHoverLabel?: string;
}
export function PsbtInputOutputItemLayout({
  address,
  addressHoverLabel,
  amount,
  pillHoverLabel,
  pillLabel,
  txId,
  txIdHoverLabel,
}: PsbtInputOutputItemLayoutProps) {
  const { onCopy, hasCopied } = useClipboard(addressHoverLabel ?? '');
  const { handleOpenTxLink } = useExplorerLink();

  return (
    <Flag align="middle" img={<></>} mt="loose" spacing="base">
      <SpaceBetween>
        <Flex alignItems="center">
          <Text color={color('text-caption')} fontSize={1} mr="extra-tight">
            {address}
          </Text>
          <Tooltip
            disabled={!addressHoverLabel}
            hideOnClick={false}
            label={hasCopied ? 'Copied!' : addressHoverLabel}
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
              {addressHoverLabel ? <FiCopy size="16px" /> : null}
            </Box>
          </Tooltip>
          {pillLabel ? (
            <Tooltip label={pillHoverLabel} maxWidth="200px" placement="bottom">
              <Box
                border="1px solid #DCDDE2"
                borderRadius="24px"
                lineHeight="16px"
                ml="base-tight"
                px="tight"
              >
                <Text color={color('text-caption')} fontSize={0}>
                  {pillLabel}
                </Text>
              </Box>
            </Tooltip>
          ) : null}
        </Flex>
        <Text color={color('text-caption')} fontSize={1}>
          {amount}
        </Text>
      </SpaceBetween>
      <Box mt="tight">
        {txId && txIdHoverLabel ? (
          <Link
            _hover={{ textDecoration: 'none' }}
            fontSize="14px"
            mr="4px !important"
            onClick={() =>
              handleOpenTxLink({
                blockchain: 'bitcoin',
                txid: txIdHoverLabel ?? '',
              })
            }
          >
            <Tooltip
              disabled={!txIdHoverLabel}
              hideOnClick={false}
              label={txIdHoverLabel}
              labelProps={{ wordWrap: 'break-word' }}
              maxWidth="230px"
              placement="bottom"
            >
              <Text color={color('brand')} fontSize={1} mr="extra-tight">
                {txId}
              </Text>
            </Tooltip>
          </Link>
        ) : null}
      </Box>
    </Flag>
  );
}
