import type { Inscription } from '@leather.io/models';
import { OrdinalAvatarIcon } from '@leather.io/ui';
import { isUndefined } from '@leather.io/utils';

import { openInNewTab } from '@app/common/utils/open-in-new-tab';
import { InscriptionPreview } from '@app/components/inscription-preview-card/components/inscription-preview';
import { useInscription } from '@app/query/bitcoin/ordinals/inscription.hooks';

import { PsbtAddressTotalItem } from './psbt-address-total-item';

interface PsbtInscriptionProps {
  inscription: Inscription;
}
export function PsbtInscription({ inscription }: PsbtInscriptionProps) {
  const { isLoading, isError, data: supportedInscription } = useInscription(inscription?.id ?? '');

  if (isLoading) return null;
  if (isError || isUndefined(supportedInscription))
    return (
      <PsbtAddressTotalItem
        image={<OrdinalAvatarIcon />}
        title="Inscription not found"
        value="# Unknown"
      />
    );

  return (
    <PsbtAddressTotalItem
      image={<InscriptionPreview inscription={supportedInscription} height="40px" width="40px" />}
      title="Inscription"
      value={`#${inscription?.number}`}
      valueAction={() => openInNewTab(inscription.preview)}
    />
  );
}
