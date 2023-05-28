import { truncateMiddle } from '@stacks/ui-utils';

import { openInNewTab } from '@app/common/utils/open-in-new-tab';
import { InscriptionPreview } from '@app/components/inscription-preview-card/components/inscription-preview';
import { useInscription } from '@app/query/bitcoin/ordinals/inscription.hooks';

import { PsbtDecodedNodeLayout } from './psbt-decoded-node.layout';

interface PsbtInputWithInscriptionProps {
  address: string;
  inputValue: string;
  path: string;
}
export function PsbtInputWithInscription({
  address,
  inputValue,
  path,
}: PsbtInputWithInscriptionProps) {
  const {
    isLoading,
    isError,
    data: inscription,
  } = useInscription(path.replace('/inscription/', ''));

  if (isLoading || isError) return null;

  return (
    <PsbtDecodedNodeLayout
      hoverLabel={address}
      image={<InscriptionPreview inscription={inscription} height="40px" width="40px" />}
      subtitle={truncateMiddle(address)}
      subValue={`#${inscription.number}`}
      subValueAction={() => openInNewTab(inscription.infoUrl)}
      title="Ordinal inscription"
      value={`- ${inputValue}`}
    />
  );
}
