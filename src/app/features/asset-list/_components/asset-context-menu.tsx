import { useNavigate } from 'react-router-dom';

import { Flex } from 'leather-styles/jsx';
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
});

const menuGroupStyles = css({
  display: 'flex',
  flexDirection: 'column',
  gap: 'space.01'
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
  p: 'space.02'
});

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
      <DropdownMenu.Group className={menuGroupStyles}>
        <DropdownMenu.Item
          className={menuItemStyles}
          onClick={() => {
            navigate(`/send/${assetSymbol}${contractId ? `/${contractId}` : ''}`);
            onClose?.();
          }}
        >
          <Flex alignItems="center" gap="space.01" opacity="inherit" className={menuItemContentStyles}>
            <PaperPlaneIcon variant="small" />
            Send
          </Flex>
        </DropdownMenu.Item>
        <DropdownMenu.Item 
          className={menuItemStyles}
          onClick={handleReceiveClick}
        >
          <Flex alignItems="center" gap="space.01" opacity="inherit" className={menuItemContentStyles}>
            <InboxIcon variant="small" />
            Receive
          </Flex>
        </DropdownMenu.Item>
        <DropdownMenu.Item 
          className={menuItemStyles}
          onClick={() => {
            if (!isSwapEnabled) return;
            navigate(`/swap/${assetSymbol}`);
            onClose?.();
          }}
          disabled={!isSwapEnabled}
        >
          <Flex alignItems="center" gap="space.01" opacity="inherit" className={menuItemContentStyles}>
            <ArrowsRepeatLeftRightIcon variant="small" />
            Swap
          </Flex>
        </DropdownMenu.Item>
      </DropdownMenu.Group>
    </DropdownMenu.Content>
  );
}
