import { HStack, styled } from 'leather-styles/jsx';

import { ChevronRightIcon, Pressable } from '@leather.io/ui';

interface ManageTokensButtonProps {
  showManageTokens: boolean;
  setShowManageTokens: React.Dispatch<React.SetStateAction<boolean>>;
}

export function ManageTokensButton({
  showManageTokens,
  setShowManageTokens,
}: ManageTokensButtonProps) {
  return (
    <Pressable
      onClick={() => {
        setShowManageTokens(!showManageTokens);
      }}
    >
      <HStack alignItems="center" justifyContent="space-between" width="100%">
        <styled.span textStyle="body.02">Manage Tokens</styled.span>
        <ChevronRightIcon marginRight="6px" variant='small' />
      </HStack>
    </Pressable>
  );
}
