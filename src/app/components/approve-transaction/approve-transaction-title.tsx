import { HStack, styled } from 'leather-styles/jsx';

import { SkeletonLoader } from '@leather.io/ui';

interface ApproveTransactionActionsTitleProps {
  isLoading: boolean;
  amount: string;
}

export function ApproveTransactionActionsTitle({
  isLoading,
  amount,
}: ApproveTransactionActionsTitleProps) {
  return (
    <HStack justify="space-between" mb="space.03">
      <SkeletonLoader isLoading={isLoading} height="20px" width="96px">
        <styled.span textStyle="label.02">Total spend</styled.span>
      </SkeletonLoader>
      <SkeletonLoader isLoading={isLoading} height="20px" width="78px">
        <styled.span textStyle="label.02">{amount}</styled.span>
      </SkeletonLoader>
    </HStack>
  );
}
