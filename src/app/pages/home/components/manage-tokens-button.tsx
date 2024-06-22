import { HStack, styled } from 'leather-styles/jsx';

import { ChevronsRightIcon, Pressable } from '@leather.io/ui';

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
        <styled.span textStyle="caption.01">Manage Tokens</styled.span>
        <ChevronsRightIcon marginRight="8px" />
      </HStack>
    </Pressable>
  );
}
