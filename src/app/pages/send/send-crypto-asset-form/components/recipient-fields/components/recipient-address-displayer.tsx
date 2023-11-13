import { useCallback } from 'react';

import { SendCryptoAssetSelectors } from '@tests/selectors/send.selectors';
import { HStack, styled } from 'leather-styles/jsx';

import { useAnalytics } from '@app/common/hooks/analytics/use-analytics';
import { useClipboard } from '@app/common/hooks/use-copy-to-clipboard';
import { Tooltip } from '@app/components/tooltip';
import { CopyIcon } from '@app/ui/components/icons/copy-icon';

interface RecipientAddressDisplayerProps {
  address: string;
}
export function RecipientAddressDisplayer({ address }: RecipientAddressDisplayerProps) {
  const analytics = useAnalytics();
  const { onCopy, hasCopied } = useClipboard(address);

  const copyToClipboard = useCallback(() => {
    void analytics.track('copy_recipient_bns_address_to_clipboard');
    onCopy();
  }, [analytics, onCopy]);

  return (
    <HStack alignItems="center" justifyContent="space-between" mb="space.04" width="100%">
      <styled.span
        textStyle="caption.02"
        data-testid={SendCryptoAssetSelectors.RecipientBnsAddressLabel}
      >
        {address}
      </styled.span>
      <Tooltip hideOnClick={false} label={hasCopied ? 'Copied!' : 'Copy address'} placement="right">
        <styled.button
          _hover={{ cursor: 'pointer' }}
          data-testid={SendCryptoAssetSelectors.RecipientBnsAddressCopyToClipboard}
          onClick={copyToClipboard}
          type="button"
        >
          <CopyIcon size="16px" />
        </styled.button>
      </Tooltip>
    </HStack>
  );
}
