import { HStack, styled } from 'leather-styles/jsx';

import { ChevronRightIcon, Pressable } from '@leather.io/ui';

interface ManageTokensButtonProps {
  showManageTokens: boolean;
  onSetShowManageTokens: React.Dispatch<React.SetStateAction<boolean>>;
}

export function ManageTokensButton({
  showManageTokens,
  onSetShowManageTokens,
}: ManageTokensButtonProps) {
  return (
    <Pressable
      onClick={() => {
        onSetShowManageTokens(!showManageTokens);
      }}
    >
      <HStack alignItems="center" justifyContent="space-between" width="100%">
        <styled.span textStyle="body.02">Manage Tokens</styled.span>
        <ChevronRightIcon marginRight="space.02" variant="small" />
      </HStack>
    </Pressable>
  );
}
