import React from 'react';
import { useNavigate } from 'react-router-dom';
import * as ContextMenu from '@radix-ui/react-context-menu';

import { HStack } from 'leather-styles/jsx';
import { css } from 'leather-styles/css';

import {
  PaperPlaneIcon,
  InboxIcon,
  ArrowsRepeatLeftRightIcon,
} from '@leather.io/ui';

import { copyToClipboard } from '@app/common/utils/copy-to-clipboard';
import { useToast } from '@app/features/toasts/use-toast';
import { useConfigSwapsEnabled } from '@app/query/common/remote-config/remote-config.query';
import { analytics } from '@shared/utils/analytics';

interface AssetContextMenuProps {
  assetSymbol: string;
  contractId?: string;
  address: string;
  children: React.ReactNode;
}

const menuStyles = css({
  backgroundColor: 'ink.background-primary',
  borderRadius: 'sm',
  boxShadow: 'menu',
  border: '1px solid',
  borderColor: 'ink.border-default',
  minWidth: '140px',
  overflow: 'hidden',
  padding: 'space.01',
});

const menuItemStyles = css({
  opacity: 1,
  width: '100%',
  cursor: 'pointer',
  display: 'block',
  outline: 'none',
  borderRadius: 'xs',
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
    <ContextMenu.Item 
      className={menuItemStyles}
      onClick={onClick}
      disabled={disabled}
    >
      <HStack className={menuItemContentStyles}>
        {icon}
        {label}
      </HStack>
    </ContextMenu.Item>
  );
}

export function AssetContextMenu({ 
  assetSymbol, 
  contractId, 
  address,
  children,
}: AssetContextMenuProps) {
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
  };

  return (
    <ContextMenu.Root>
      <ContextMenu.Trigger asChild>
        {children}
      </ContextMenu.Trigger>
      <ContextMenu.Portal>
        <ContextMenu.Content
          className={menuStyles}
          style={{
            zIndex: 999,
          }}
          onPointerDownOutside={(e) => {
            e.preventDefault();
          }}
        >
          <ContextMenu.Group>
            <AssetContextMenuItem
              icon={<PaperPlaneIcon variant="small" />}
              label="Send"
              onClick={() => {
                navigate(`/send/${assetSymbol}${contractId ? `/${contractId}` : ''}`);
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
                
                // Normalize the asset symbol for URL construction
                // This handles special characters and ensures consistent casing
                const normalizedSymbol = assetSymbol.toLowerCase().trim();
                
                // Determine chain based on normalized asset symbol
                const chain = normalizedSymbol === 'btc' ? 'bitcoin' : 'stacks';
                
                // Construct the URL with the normalized symbol
                const url = `/swap/${chain}/${normalizedSymbol}`;
                
                navigate(url);
              }}
              disabled={!isSwapEnabled}
            />
          </ContextMenu.Group>
        </ContextMenu.Content>
      </ContextMenu.Portal>
    </ContextMenu.Root>
  );
}
