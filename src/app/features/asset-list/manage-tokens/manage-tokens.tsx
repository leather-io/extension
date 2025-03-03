import { useState } from 'react';

import { HomePageSelectors } from '@tests/selectors/home.selectors';
import { HStack, Stack, styled } from 'leather-styles/jsx';

import { Caption, ChevronRightIcon, Pressable, Sheet, SheetHeader } from '@leather.io/ui';

import { AssetList } from '../asset-list';

export function ManageTokens() {
  const [showManageTokens, setShowManageTokens] = useState(false);
  const [hasManageableTokens, setHasManageableTokens] = useState(false);

  return (
    <>
      <Pressable
        className="group"
        data-testid={HomePageSelectors.ManageTokensBtn}
        mt="space.04"
        py="space.02"
        position="relative"
        _before={{
          content: '""',
          rounded: 'xs',
          position: 'absolute',
          top: '-space.01',
          left: '-space.03',
          bottom: '-space.01',
          right: '-space.03',
        }}
        _hover={{
          _before: {
            bg: 'ink.component-background-hover',
            borderColor: 'transparent',
          },
        }}
        onClick={() => {
          setShowManageTokens(!showManageTokens);
        }}
      >
        <HStack alignItems="center" justifyContent="space-between" width="100%">
          <styled.span textStyle="body.02">Manage Tokens</styled.span>
          <ChevronRightIcon variant="small" />
        </HStack>
      </Pressable>

      <Sheet
        isShowing={showManageTokens}
        onClose={() => setShowManageTokens(!showManageTokens)}
        header={<SheetHeader title="Manage tokens" />}
      >
        <Stack gap="space.05" px="space.05" data-testid={HomePageSelectors.ManageTokensAssetsList}>
          <AssetList
            assetRightElementVariant="toggle"
            filter="all"
            showUnmanageableTokens={false}
            setHasManageableTokens={setHasManageableTokens}
          />

          {!hasManageableTokens && (
            <Stack h="100%" justify="center" align="center">
              <Caption>No tokens found</Caption>
            </Stack>
          )}
        </Stack>
      </Sheet>
    </>
  );
}
