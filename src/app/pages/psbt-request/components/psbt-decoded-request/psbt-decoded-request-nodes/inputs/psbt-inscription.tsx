import { Box } from '@stacks/ui';

import { openInNewTab } from '@app/common/utils/open-in-new-tab';
import { InscriptionPreview } from '@app/components/inscription-preview-card/components/inscription-preview';
import { InscriptionPreviewCard } from '@app/components/inscription-preview-card/inscription-preview-card';
import { useInscription } from '@app/query/bitcoin/ordinals/inscription.hooks';

export function PsbtInscription(props: { path: string }) {
  const { path } = props;
  const { isLoading, isError, data: inscription } = useInscription(path);

  if (isLoading) return null;
  if (isError) return null;

  return (
    <Box mt="loose">
      <InscriptionPreviewCard
        action={() => openInNewTab(inscription.infoUrl)}
        actionLabel="View details"
        hideBorder
        image={<InscriptionPreview inscription={inscription} />}
        subtitle="Ordinal inscription"
        title={`#${inscription.inscription_number}`}
      />
    </Box>
  );
}
