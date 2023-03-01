import { useCallback } from 'react';
import { FiCopy, FiInfo } from 'react-icons/fi';

import { Box, Stack, Text, Tooltip, color, useClipboard } from '@stacks/ui';
import { truncateMiddle } from '@stacks/ui-utils';
import { SendCryptoAssetSelectors } from '@tests/selectors/send.selectors';

import { useAnalytics } from '@app/common/hooks/analytics/use-analytics';

export function RecipientFieldBnsAddress(props: { bnsAddress: string }) {
  const { bnsAddress } = props;
  const analytics = useAnalytics();
  const { onCopy, hasCopied } = useClipboard(bnsAddress);

  const copyToClipboard = useCallback(() => {
    void analytics.track('copy_resolved_address_to_clipboard');
    onCopy();
  }, [analytics, onCopy]);

  const onHover = useCallback(
    () => analytics.track('view_resolved_recipient_address'),
    [analytics]
  );

  return (
    <Stack isInline spacing="tight" zIndex={999}>
      <Text
        color={color('text-caption')}
        data-testid={SendCryptoAssetSelectors.ResolvedBnsAddressLabel}
        fontSize={0}
      >
        {truncateMiddle(bnsAddress, 4)}
      </Text>
      <Tooltip label={bnsAddress} maxWidth="none" placement="bottom">
        <Stack>
          <Box
            _hover={{ cursor: 'pointer' }}
            as={FiInfo}
            color={color('text-caption')}
            data-testid={SendCryptoAssetSelectors.ResolvedBnsAddressInfoIcon}
            onMouseOver={onHover}
            size="12px"
          />
        </Stack>
      </Tooltip>
      <Tooltip label={hasCopied ? 'Copied!' : 'Copy address'} placement="right">
        <Stack>
          <Box
            _hover={{ cursor: 'pointer' }}
            as={FiCopy}
            color={color('text-caption')}
            data-testid={SendCryptoAssetSelectors.ResolvedBnsAddressCopyToClipboard}
            onClick={copyToClipboard}
            size="12px"
          />
        </Stack>
      </Tooltip>
    </Stack>
  );
}
