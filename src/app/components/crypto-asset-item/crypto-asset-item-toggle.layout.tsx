import { type ChangeEvent } from 'react';
import { useDispatch } from 'react-redux';

import { Box, VStack } from 'leather-styles/jsx';

import { ItemLayout } from '@leather.io/ui';
import { spamFilter } from '@leather.io/utils';

import { isTokenEnabled } from '@app/common/filter-tokens';
import { useCurrentAccountIndex } from '@app/store/accounts/account';
import { setToken, useAllTokens } from '@app/store/manage-tokens/manage-tokens.slice';
import { Toggle } from '@app/ui/components/toggle/toggle';

interface CryptoAssetItemToggleLayoutProps {
  captionLeft: string;
  icon: React.ReactNode;
  titleLeft: string;
  contractId?: string;
}

export function CryptoAssetItemToggleLayout({
  captionLeft,
  icon,
  titleLeft,
  contractId,
}: CryptoAssetItemToggleLayoutProps) {
  const userSetTokens = useAllTokens();
  const accountIndex = useCurrentAccountIndex();
  const dispatch = useDispatch();

  const tokenId = contractId ?? titleLeft;

  function handleSelection(e: ChangeEvent<HTMLInputElement>, isSelected: boolean) {
    const token = e.target.value;
    dispatch(setToken({ id: token, enabled: isSelected, accountIndex }));
  }

  const toggle = (
    <VStack h="100%" justifyContent="center">
      <Toggle
        handleSelection={handleSelection}
        inputValue={contractId ?? titleLeft}
        getInitialState={() =>
          isTokenEnabled({ accountIndex, userSetTokens, tokenIdentifier: tokenId })
        }
      />
    </VStack>
  );

  const content = (
    <ItemLayout
      flagImg={icon}
      titleLeft={spamFilter(titleLeft)}
      captionLeft={spamFilter(captionLeft)}
      titleRight={toggle}
    />
  );

  return <Box my="space.02">{content}</Box>;
}
