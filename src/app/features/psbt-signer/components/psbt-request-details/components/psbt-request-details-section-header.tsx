import { FiArrowUp } from 'react-icons/fi';

import { Stack, Text } from '@stacks/ui';

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
      <Text fontWeight={500}>{title}</Text>
      {hasDetails && onSetShowDetails ? (
        <Stack alignItems="center" isInline spacing="extra-tight">
          <Text
            as="button"
            fontSize={2}
            fontWeight={500}
            onClick={() => onSetShowDetails(!showDetails)}
            type="button"
          >
            {showDetails ? 'See less' : 'See details'}
          </Text>
          {showDetails ? <FiArrowUp /> : <></>}
        </Stack>
      ) : null}
    </SpaceBetween>
  );
}
