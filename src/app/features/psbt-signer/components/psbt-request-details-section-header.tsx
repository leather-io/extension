import { HStack, styled } from 'leaf-styles/jsx';

import { LeatherButton } from '@app/components/button/button';
import { ArrowUpIcon } from '@app/components/icons/arrow-up-icon';
import { SpaceBetween } from '@app/components/layout/space-between';

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
    <SpaceBetween>
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
    </SpaceBetween>
  );
}
