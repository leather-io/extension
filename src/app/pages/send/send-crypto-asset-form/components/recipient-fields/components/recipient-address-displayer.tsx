import { useCallback } from 'react';

import { SendCryptoAssetSelectors } from '@tests/selectors/send.selectors';
import { HStack, styled } from 'leather-styles/jsx';

import { CopyIcon } from '@leather.io/ui';

import { analytics } from '@shared/utils/analytics';

import { useClipboard } from '@app/common/hooks/use-copy-to-clipboard';
import { BasicTooltip } from '@app/ui/components/tooltip/basic-tooltip';

interface RecipientAddressDisplayerProps {
  address: string;
}
export function RecipientAddressDisplayer({ address }: RecipientAddressDisplayerProps) {
  const { onCopy, hasCopied } = useClipboard(address);

  const copyToClipboard = useCallback(() => {
    void analytics.track('copy_recipient_bns_address_to_clipboard');
    onCopy();
  }, [onCopy]);

  return (
    <HStack mb="space.04" width="100%" px="space.04" mt="space.02">
      <styled.span
        textStyle="caption.01"
        data-testid={SendCryptoAssetSelectors.RecipientBnsAddressLabel}
      >
        {address}
      </styled.span>
      {/** TODO: We need to persist the tooltip after it is clicked.
           Current implementation of radix-ui tooltip doesn't allow that, ref: https://github.com/radix-ui/primitives/issues/2029 */}
      <BasicTooltip label={hasCopied ? 'Copied!' : 'Copy address'} side="right" asChild>
        <styled.button
          _hover={{ cursor: 'pointer' }}
          data-testid={SendCryptoAssetSelectors.RecipientBnsAddressCopyToClipboard}
          onClick={copyToClipboard}
          type="button"
        >
          <CopyIcon />
        </styled.button>
      </BasicTooltip>
    </HStack>
  );
}
