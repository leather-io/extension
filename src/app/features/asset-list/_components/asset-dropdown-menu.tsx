import { useNavigate } from 'react-router-dom';

import { css } from 'leather-styles/css';
import { HStack } from 'leather-styles/jsx';

import { ArrowsRepeatLeftRightIcon, DropdownMenu, InboxIcon, PaperPlaneIcon } from '@leather.io/ui';

import { analytics } from '@shared/utils/analytics';

import { copyToClipboard } from '@app/common/utils/copy-to-clipboard';
import { useToast } from '@app/features/toasts/use-toast';
import { useConfigSwapsEnabled } from '@app/query/common/remote-config/remote-config.query';

interface AssetDropdownMenuProps {
  assetSymbol: string;
  contractId?: string;
  address: string;
  onClose?(): void;
}

const menuStyles = css({
  backgroundColor: 'ink.background-primary',
  borderRadius: 'sm',
  boxShadow: 'menu',
  border: '1px solid',
  borderColor: 'ink.border-default',
  minWidth: '140px',
  overflow: 'hidden',
  // Override default padding
  '& > div > div': {
    padding: '0 !important',
  },
  '& > div > div > div': {
    padding: '0 !important',
  },
});

const menuItemStyles = css({
  opacity: 1,
  width: '100%',
  cursor: 'pointer',
  display: 'block',
  outline: 'none',
  _hover: {
    backgroundColor: 'ink.component-background-hover',
  },
  '&[data-disabled]': {
    opacity: 0.5,
    cursor: 'not-allowed',
    _hover: {
      backgroundColor: 'transparent',
    },
  },
});

const menuItemContentStyles = css({
  width: '100%',
  px: 'space.03',
  py: 'space.02',
  gap: 'space.02',
});

interface AssetDropdownMenuItemProps {
  icon: React.ReactNode;
  label: string;
  onClick?(): void;
  disabled?: boolean;
}

function AssetDropdownMenuItem({ icon, label, onClick, disabled }: AssetDropdownMenuItemProps) {
  return (
    <DropdownMenu.Item className={menuItemStyles} onClick={onClick} disabled={disabled}>
      <HStack className={menuItemContentStyles}>
        {icon}
        {label}
      </HStack>
    </DropdownMenu.Item>
  );
}

export function AssetDropdownMenu({
  assetSymbol,
  contractId,
  address,
  onClose,
}: AssetDropdownMenuProps) {
  const navigate = useNavigate();
  const toast = useToast();
  const isSwapEnabled = useConfigSwapsEnabled();

  const handleReceiveClick = async () => {
    // Track analytics based on asset type
    const lowerCaseSymbol = assetSymbol.toLowerCase();

    if (lowerCaseSymbol === 'btc') {
      // For BTC, we need to include the type parameter
      void analytics.track('copy_btc_address_to_clipboard', { type: 'btc' });
    } else {
      // For STX and other tokens, no second parameter is needed
      void analytics.track('copy_stx_address_to_clipboard');
    }

    await copyToClipboard(address);
    toast.success('Address copied to clipboard');
    onClose?.();
  };

  return (
    <DropdownMenu.Content
      className={menuStyles}
      sideOffset={2}
      align="start"
      side="bottom"
      style={{
        zIndex: 999,
      }}
      avoidCollisions
      onPointerDownOutside={e => {
        e.preventDefault();
        onClose?.();
      }}
    >
      <DropdownMenu.Group>
        <AssetDropdownMenuItem
          icon={<PaperPlaneIcon variant="small" />}
          label="Send"
          onClick={() => {
            navigate(`/send/${assetSymbol}${contractId ? `/${contractId}` : ''}`);
            onClose?.();
          }}
        />
        <AssetDropdownMenuItem
          icon={<InboxIcon variant="small" />}
          label="Receive"
          onClick={handleReceiveClick}
        />
        <AssetDropdownMenuItem
          icon={<ArrowsRepeatLeftRightIcon variant="small" />}
          label="Swap"
          onClick={() => {
            if (!isSwapEnabled) return;

            // Normalize the asset symbol for URL construction
            // This handles special characters and ensures consistent casing
            const normalizedSymbol = assetSymbol.toLowerCase().trim();

            // Determine chain based on normalized asset symbol
            const chain = normalizedSymbol === 'btc' ? 'bitcoin' : 'stacks';

            // Construct the URL with the normalized symbol
            const url = `/swap/${chain}/${normalizedSymbol}`;

            navigate(url);
            onClose?.();
          }}
          disabled={!isSwapEnabled}
        />
      </DropdownMenu.Group>
    </DropdownMenu.Content>
  );
}
