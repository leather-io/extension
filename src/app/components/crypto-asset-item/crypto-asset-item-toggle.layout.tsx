import { useState } from 'react';
import { useDispatch } from 'react-redux';

import { Box, VStack } from 'leather-styles/jsx';

import { ItemLayout, Pressable, Switch } from '@leather.io/ui';
import { spamFilter } from '@leather.io/utils';

import { useCurrentAccountIndex } from '@app/store/accounts/account';
import { manageTokensSlice } from '@app/store/manage-tokens/manage-tokens.slice';

interface CryptoAssetItemToggleLayoutProps {
  captionLeft: string;
  icon: React.ReactNode;
  titleLeft: string;
  assetId: string;
  isCheckedByDefault?: boolean;
}

export function CryptoAssetItemToggleLayout({
  captionLeft,
  icon,
  titleLeft,
  assetId,
  isCheckedByDefault = false,
}: CryptoAssetItemToggleLayoutProps) {
  const accountIndex = useCurrentAccountIndex();
  const dispatch = useDispatch();

  const [isChecked, setIsChecked] = useState(isCheckedByDefault);

  function handleSelection(enabled: boolean) {
    setIsChecked(enabled);
    dispatch(manageTokensSlice.actions.setToken({ id: assetId, enabled, accountIndex }));
  }

  const toggle = (
    <VStack h="100%" justifyContent="center">
      <Switch.Root onCheckedChange={handleSelection} checked={isChecked} id={assetId}>
        <Switch.Thumb />
      </Switch.Root>
    </VStack>
  );

  const content = (
    <Pressable onClick={() => handleSelection(!isChecked)} data-testid={assetId}>
      <ItemLayout
        img={icon}
        titleLeft={spamFilter(titleLeft)}
        captionLeft={spamFilter(captionLeft)}
        titleRight={toggle}
      />
    </Pressable>
  );

  return <Box my="space.02">{content}</Box>;
}
