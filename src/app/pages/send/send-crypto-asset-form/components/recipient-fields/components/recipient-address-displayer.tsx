import { SendCryptoAssetSelectors } from '@tests/selectors/send.selectors';
import { motion } from 'framer-motion';
import { HStack } from 'leather-styles/jsx';

import { AddressDisplayer, CopyIcon } from '@leather.io/ui';

import { analytics } from '@shared/utils/analytics';

import { useClipboard } from '@app/common/hooks/use-copy-to-clipboard';
import { useToast } from '@app/features/toasts/use-toast';

interface RecipientAddressDisplayerProps {
  address: string;
}
export function RecipientAddressDisplayer({ address }: RecipientAddressDisplayerProps) {
  const { onCopy } = useClipboard(address);
  const toast = useToast();

  function copyToClipboard() {
    toast.success('Copied to clipboard!');

    void analytics.track('copy_recipient_bns_address_to_clipboard');
    onCopy();
  }

  return (
    <HStack mb="space.04" width="100%" mt="space.02">
      <HStack onClick={copyToClipboard} cursor="pointer">
        <AddressDisplayer
          data-testid={SendCryptoAssetSelectors.RecipientBnsAddressLabel}
          address={address}
        />

        <motion.button
          type="button"
          whileTap={{ scale: 0.85 }}
          data-testid={SendCryptoAssetSelectors.RecipientBnsAddressCopyToClipboard}
        >
          <CopyIcon />
        </motion.button>
      </HStack>
    </HStack>
  );
}
