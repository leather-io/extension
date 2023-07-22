import { isUndefined } from '@shared/utils';

import { openInNewTab } from '@app/common/utils/open-in-new-tab';
import { OrdinalIcon } from '@app/components/icons/ordinal-icon';
import { InscriptionPreview } from '@app/components/inscription-preview-card/components/inscription-preview';
import { useInscription } from '@app/query/bitcoin/ordinals/inscription.hooks';

import { PsbtAddressTotalItem } from './psbt-address-total-item';

interface PsbtInscriptionProps {
  path: string;
}
export function PsbtInscription({ path }: PsbtInscriptionProps) {
  const {
    isLoading,
    isError,
    data: inscription,
  } = useInscription(path.replace('/inscription/', ''));

  if (isLoading) return null;
  if (isError || isUndefined(inscription))
    return (
      <PsbtAddressTotalItem
        image={<OrdinalIcon />}
        title="Inscription not found"
        value="# Unknown"
      />
    );

  return (
    <PsbtAddressTotalItem
      image={<InscriptionPreview inscription={inscription} height="40px" width="40px" />}
      title="Inscription"
      value={`#${inscription.number}`}
      valueAction={() => openInNewTab(inscription.infoUrl)}
    />
  );
}
