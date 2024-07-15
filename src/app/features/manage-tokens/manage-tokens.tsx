import { useState } from 'react';

import { Stack } from 'leather-styles/jsx';

import { Dialog } from '@leather.io/ui';

import type { RightElementVariant } from '@app/common/asset-list-utils';
import { NoTokensFound } from '@app/components/no-tokens-found/no-tokens-found';
import { BitcoinStandardsList } from '@app/features/asset-list/bitcoin/bitcoin-standards-list/bitcoin-standards-list';
import { StacksAssetsList } from '@app/features/asset-list/stacks/stacks-assets-list/stacks-assets-list';
import { DialogHeader } from '@app/ui/components/containers/headers/dialog-header';

interface ManageTokensProps {
  onClose(): void;
}

export function ManageTokensDialog({ onClose }: ManageTokensProps) {
  const [hasTokens, setHasTokens] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const variant = 'read-only';

  function hasTokenSetter(tokensLength: number) {
    setIsLoading(false);
    if (tokensLength) setHasTokens(true);
  }

  const rightElementVariant: RightElementVariant = 'toggle';
  return (
    <Dialog header={<DialogHeader title="Manage Tokens" />} isShowing onClose={onClose}>
      <Stack pb="space.06" px="space.05" h="40vh">
        <BitcoinStandardsList
          rightElementVariant={rightElementVariant}
          variant={variant}
          hasTokenSetter={hasTokenSetter}
        />
        <StacksAssetsList
          variant={variant}
          filter="all"
          showStx={false}
          hasTokenSetter={hasTokenSetter}
          rightElementVariant={rightElementVariant}
        />
        {!isLoading && !hasTokens && <NoTokensFound />}
      </Stack>
    </Dialog>
  );
}
