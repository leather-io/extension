import { useInscriptionTextContentQuery } from '@app/query/bitcoin/ordinals/inscription-text-content.query';
import { OrdinalIcon } from '@app/ui/components/icons/ordinal-icon';

import { CollectibleText } from '../_collectible-types/collectible-text';

function processContent(content: string) {
  try {
    return JSON.stringify(JSON.parse(content), null, 2);
  } catch (e) {
    return content;
  }
}

interface InscriptionTextProps {
  contentSrc: string;
  inscriptionNumber: number;
  onClickCallToAction(): void;
  onClickSend(): void;
}
export function InscriptionText({
  contentSrc,
  inscriptionNumber,
  onClickCallToAction,
  onClickSend,
}: InscriptionTextProps) {
  const query = useInscriptionTextContentQuery(contentSrc);

  if (query.isLoading || query.isError) return null;

  return (
    <CollectibleText
      icon={<OrdinalIcon size="30px" />}
      key={inscriptionNumber}
      onClickCallToAction={onClickCallToAction}
      onClickSend={onClickSend}
      content={processContent(query.data)}
      subtitle="Ordinal inscription"
      title={`# ${inscriptionNumber}`}
    />
  );
}
