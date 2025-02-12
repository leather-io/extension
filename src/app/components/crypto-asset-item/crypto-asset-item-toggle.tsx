import { useRef, useTransition } from 'react';
import { useDispatch } from 'react-redux';

import { sanitize } from 'dompurify';
import { Box, VStack } from 'leather-styles/jsx';

import { ItemLayout, Pressable, Switch } from '@leather.io/ui';

import { useSpamFilterWithWhitelist } from '@app/common/spam-filter/use-spam-filter';
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

  const spamFilter = useSpamFilterWithWhitelist();

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

  function onClick() {
    switchRef.current?.click();
  }

  const toggle = (
    <VStack h="100%" justifyContent="center">
      <Switch.Root
        ref={switchRef}
        defaultChecked={isCheckedByDefault}
        onCheckedChange={handleSelection}
        id={assetId}
        onClick={onClick}
      >
        <Switch.Thumb />
      </Switch.Root>
    </VStack>
  );

  return (
    <Box my="space.02">
      <Pressable onClick={onClick} data-testid={sanitize(assetId)}>
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
