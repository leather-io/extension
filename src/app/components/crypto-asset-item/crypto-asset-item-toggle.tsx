import { useRef, useTransition } from 'react';
import { useDispatch } from 'react-redux';

import { sanitize } from 'dompurify';
import { Box, VStack } from 'leather-styles/jsx';

import { ItemLayout, Pressable, Switch } from '@leather.io/ui';
import { spamFilter } from '@leather.io/utils';

import { useCurrentAccountIndex } from '@app/store/accounts/account';
import { manageTokensSlice } from '@app/store/manage-tokens/manage-tokens.slice';

export interface CryptoAssetItemToggleProps {
  captionLeft: string;
  icon: React.ReactNode;
  titleLeft: string;
  assetId: string;
  isCheckedByDefault: boolean;
}

export function CryptoAssetItemToggle({
  captionLeft,
  icon,
  titleLeft,
  assetId,
  isCheckedByDefault = false,
}: CryptoAssetItemToggleProps) {
  const accountIndex = useCurrentAccountIndex();
  const dispatch = useDispatch();

  const switchRef = useRef<HTMLButtonElement>(null);
  const [_isPending, transition] = useTransition();

  function handleSelection(enabled: boolean) {
    transition(() => {
      dispatch(
        manageTokensSlice.actions.userTogglesTokenVisibility({
          id: assetId,
          enabled,
          accountIndex,
        })
      );
    });
  }

  const toggle = (
    <VStack h="100%" justifyContent="center">
      <Switch.Root
        ref={switchRef}
        defaultChecked={isCheckedByDefault}
        onCheckedChange={handleSelection}
        id={assetId}
      >
        <Switch.Thumb />
      </Switch.Root>
    </VStack>
  );

  return (
    <Box my="space.02">
      <Pressable onClick={() => switchRef.current?.click()} data-testid={sanitize(assetId)}>
        <ItemLayout
          img={icon}
          titleLeft={spamFilter(titleLeft)}
          captionLeft={spamFilter(captionLeft)}
          titleRight={toggle}
        />
      </Pressable>
    </Box>
  );
}
