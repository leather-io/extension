import { HStack, styled } from 'leather-styles/jsx';

import { LeatherButton } from '@app/components/button/button';
import { ArrowUpIcon } from '@app/components/icons/arrow-up-icon';

interface PsbtRequestDetailsSectionHeaderProps {
  hasDetails?: boolean;
  onSetShowDetails?(value: boolean): void;
  showDetails?: boolean;
  title: string;
}
export function PsbtRequestDetailsSectionHeader({
  hasDetails,
  onSetShowDetails,
  showDetails,
  title,
}: PsbtRequestDetailsSectionHeaderProps) {
  return (
    <HStack alignItems="center" justifyContent="space-between">
      <styled.span textStyle="label.01">{title}</styled.span>
      {hasDetails && onSetShowDetails ? (
        <LeatherButton onClick={() => onSetShowDetails(!showDetails)} variant="text">
          {showDetails ? (
            <HStack gap="space.01">
              See less <ArrowUpIcon />
            </HStack>
          ) : (
            'See details'
          )}
        </LeatherButton>
      ) : null}
    </HStack>
  );
}
