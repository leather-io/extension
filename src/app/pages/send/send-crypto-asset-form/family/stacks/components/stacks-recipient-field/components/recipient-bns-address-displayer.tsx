import { useCallback } from 'react';
import { FiCopy } from 'react-icons/fi';

import { Box, Stack, color, useClipboard } from '@stacks/ui';
import { SendCryptoAssetSelectors } from '@tests/selectors/send.selectors';

import { useAnalytics } from '@app/common/hooks/analytics/use-analytics';
import { AddressDisplayer } from '@app/components/address-displayer/address-displayer';
import { Tooltip } from '@app/components/tooltip';

interface BnsAddressDisplayerProps {
  address: string;
}
export function RecipientBnsAddressDisplayer({ address }: BnsAddressDisplayerProps) {
  const analytics = useAnalytics();
  const { onCopy, hasCopied } = useClipboard(address);

  const copyToClipboard = useCallback(() => {
    void analytics.track('copy_recipient_bns_address_to_clipboard');
    onCopy();
  }, [analytics, onCopy]);

  return (
    <Stack alignItems="center" isInline mb="base">
      <Box
        data-testid={SendCryptoAssetSelectors.RecipientBnsAddressLabel}
        display="flex"
        flexWrap="wrap"
        fontSize={1}
        justifyContent="flex-start"
      >
        <AddressDisplayer address={address} />
      </Box>
      <Tooltip hideOnClick={false} label={hasCopied ? 'Copied!' : 'Copy address'} placement="right">
        <Box
          _hover={{ cursor: 'pointer' }}
          as="button"
          color={color('text-caption')}
          data-testid={SendCryptoAssetSelectors.RecipientBnsAddressCopyToClipboard}
          onClick={copyToClipboard}
          size="16px"
          type="button"
        >
          <FiCopy />
        </Box>
      </Tooltip>
    </Stack>
  );
}
