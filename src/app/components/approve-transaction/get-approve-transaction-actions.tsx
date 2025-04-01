import { HStack, styled } from 'leather-styles/jsx';

import { Button, CheckmarkIcon, SkeletonLoader } from '@leather.io/ui';

interface GetApproveTransactionActionsArgs {
  isLoading: boolean;
  isInsufficientBalance: boolean;
  isBroadcasting: boolean;
  isSubmitted: boolean;
  onCancel(): void;
  onApprove(): void;
}
export function getApproveTransactionActions({
  isLoading,
  isInsufficientBalance,
  isBroadcasting,
  isSubmitted,
  onCancel,
  onApprove,
}: GetApproveTransactionActionsArgs) {
  if (isLoading) {
    return [
      <SkeletonLoader key="skeleton" isLoading height="40px" />,
      <SkeletonLoader key="skeleton" isLoading height="40px" />,
    ];
  }

  if (isInsufficientBalance) {
    return [];
  }

  if (isBroadcasting) {
    return [
      <Button key="submitting" fullWidth aria-busy disabled>
        Submitting...
      </Button>,
    ];
  }

  if (isSubmitted) {
    return [
      <Button key="submitting" fullWidth variant="success" disabled>
        <HStack justifyContent="center" alignItems="center" gap="space.02">
          <CheckmarkIcon color="ink.text-primary" variant="small" />
          <styled.span textStyle="label.02">Submitted</styled.span>
        </HStack>
      </Button>,
    ];
  }

  return [
    <Button key="cancel" onClick={onCancel} fullWidth variant="outline">
      <styled.span textStyle="label.02">Cancel</styled.span>
    </Button>,
    <Button type="submit" key="approve" onClick={onApprove} fullWidth>
      <styled.span textStyle="label.02">Approve</styled.span>
    </Button>,
  ];
}
