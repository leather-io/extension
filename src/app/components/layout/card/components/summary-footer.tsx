import { HStack } from 'leather-styles/jsx';

import { CopyIcon, ExternalLinkIcon } from '@leather.io/ui';

import { InfoCardBtn } from '@app/components/info-card/info-card';

interface SummaryFooterProps {
  onClickLink(): void;
  onClickCopy(): void;
}
export function SummaryFooter({ onClickLink, onClickCopy }: SummaryFooterProps) {
  return (
    <HStack gap="space.04" width="100%">
      <InfoCardBtn icon={ExternalLinkIcon} label="View details" onClick={onClickLink} />
      <InfoCardBtn icon={CopyIcon} label="Copy ID" onClick={onClickCopy} />
    </HStack>
  );
}
