import { type ChangeEvent, useState } from 'react';
import { useDispatch } from 'react-redux';

import { Stack, VStack } from 'leather-styles/jsx';

import { Button, Dialog } from '@leather.io/ui';

import { NoTokensFound } from '@app/components/no-tokens-found/no-tokens-found';
import { BitcoinStandardsList } from '@app/features/asset-list/bitcoin/bitcoin-standards-list/bitcoin-standards-list';
import { StacksAssetsList } from '@app/features/asset-list/stacks/stacks-assets-list/stacks-assets-list';
import { useCurrentAccountIndex } from '@app/store/accounts/account';
import { setToken, useAllTokens } from '@app/store/manage-tokens/manage-tokens.slice';
import { Footer } from '@app/ui/components/containers/footers/footer';
import { DialogHeader } from '@app/ui/components/containers/headers/dialog-header';
import Toggle from '@app/ui/components/toggle/toggle';
import { isTokenEnabled } from '@app/common/filter-tokens';

interface ManageTokensProps {
  onClose(): void;
}

export type TokenProtocol = 'stacks' | 'bitcoin';

export function ManageTokensDialog({ onClose }: ManageTokensProps) {
  const [hasTokens, setHasTokens] = useState(false);
  const accountIndex = useCurrentAccountIndex();
  const allTokens = useAllTokens();
  const dispatch = useDispatch();

  const variant = 'read-only';
  const isReadOnly = true;

  const handleSelection = (e: ChangeEvent<HTMLInputElement>, isSelected: boolean) => {
    const token = e.target.value;
    dispatch(setToken({ id: token, enabled: isSelected, accountIndex }));
  };

  const renderRightElement = (id: string) => {
    return (
      <VStack h="100%" justifyContent="center">
        <Toggle
          handleSelection={handleSelection}
          inputValue={id}
          getInitialState={() => isTokenEnabled({ accountIndex, allTokens, tokenIdentifier: id })}
        />
      </VStack>
    );
  };

  const getManageTokenList = () => {
    return (
      <>
        <BitcoinStandardsList
          showBalance={false}
          isReadOnly={isReadOnly}
          variant={variant}
          renderRightElement={renderRightElement}
          hasTokenSetter={setHasTokens}
        />
        <StacksAssetsList
          isReadOnly={isReadOnly}
          variant={variant}
          showBalance={false}
          filter="all"
          showStx={false}
          renderRightElement={renderRightElement}
          hasTokenSetter={setHasTokens}
        />
        {!hasTokens && <NoTokensFound />}
      </>
    );
  };

  return (
    <Dialog
      header={<DialogHeader title="Manage Tokens" />}
      isShowing
      onClose={onClose}
      footer={
        <Footer>
          <Button
            fullWidth
            onClick={() => {
              onClose();
            }}
          >
            Done
          </Button>
        </Footer>
      }
    >
      <Stack gap="space.05" pb="space.06" px="space.05" h="40vh">
        {getManageTokenList()}
      </Stack>
    </Dialog>
  );
}
