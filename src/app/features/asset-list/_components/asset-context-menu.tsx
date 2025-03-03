import { useNavigate } from 'react-router-dom';

import { HStack } from 'leather-styles/jsx';
import { css } from 'leather-styles/css';

import {
  PaperPlaneIcon,
  InboxIcon,
  ArrowsRepeatLeftRightIcon,
  DropdownMenu,
} from '@leather.io/ui';

import { copyToClipboard } from '@app/common/utils/copy-to-clipboard';
import { useToast } from '@app/features/toasts/use-toast';
import { useConfigSwapsEnabled } from '@app/query/common/remote-config/remote-config.query';
import { analytics } from '@shared/utils/analytics';

interface AssetContextMenuProps {
  assetSymbol: string;
  contractId?: string;
  address: string;
  onClose?: () => void;
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
    padding: '0 !important'
  },
  '& > div > div > div': {
    padding: '0 !important'
  }
});

const menuItemStyles = css({
  opacity: 1,
  width: '100%',
  cursor: 'pointer',
  display: 'block',
  outline: 'none',
  _hover: {
    backgroundColor: 'ink.component-background-hover'
  },
  '&[data-disabled]': {
    opacity: 0.5,
    cursor: 'not-allowed',
    _hover: {
      backgroundColor: 'transparent'
    }
  }
});

const menuItemContentStyles = css({
  width: '100%',
  px: 'space.03',
  py: 'space.02',
  gap: 'space.02'
});

interface AssetContextMenuItemProps {
  icon: React.ReactNode;
  label: string;
  onClick?: () => void;
  disabled?: boolean;
}

function AssetContextMenuItem({ icon, label, onClick, disabled }: AssetContextMenuItemProps) {
  return (
    <DropdownMenu.Item 
      className={menuItemStyles}
      onClick={onClick}
      disabled={disabled}
    >
      <HStack className={menuItemContentStyles}>
        {icon}
        {label}
      </HStack>
    </DropdownMenu.Item>
  );
}

export function AssetContextMenu({ 
  assetSymbol, 
  contractId, 
  address,
  onClose,
}: AssetContextMenuProps) {
  const navigate = useNavigate();
  const toast = useToast();
  const isSwapEnabled = useConfigSwapsEnabled();

  const handleReceiveClick = async () => {
    const isBtcToken = assetSymbol.toLowerCase() === 'btc';
    void analytics.track(isBtcToken ? 'copy_btc_address_to_clipboard' : 'copy_stx_address_to_clipboard');
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
    >
      <DropdownMenu.Group>
        <AssetContextMenuItem
          icon={<PaperPlaneIcon variant="small" />}
          label="Send"
          onClick={() => {
            navigate(`/send/${assetSymbol}${contractId ? `/${contractId}` : ''}`);
            onClose?.();
          }}
        />
        <AssetContextMenuItem
          icon={<InboxIcon variant="small" />}
          label="Receive"
          onClick={handleReceiveClick}
        />
        <AssetContextMenuItem
          icon={<ArrowsRepeatLeftRightIcon variant="small" />}
          label="Swap"
          onClick={() => {
            if (!isSwapEnabled) return;
            navigate(`/swap/${assetSymbol}`);
            onClose?.();
          }}
          disabled={!isSwapEnabled}
        />
      </DropdownMenu.Group>
    </DropdownMenu.Content>
  );
}
