import { Spinner } from '@stacks/ui';

import { figmaTheme } from '@app/common/utils/figma-theme';
import { useTextInscriptionContentQuery } from '@app/query/bitcoin/ordinals/use-text-ordinal-content.query';

import { CollectibleText } from '../_collectible-types/collectible-text';

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
  const query = useTextInscriptionContentQuery(contentSrc);

  if (query.isLoading) return <Spinner color={figmaTheme.icon} size="16px" />;
  if (query.isError) return null;

  return (
    <CollectibleText
      key={inscriptionNumber}
      onClickCallToAction={onClickCallToAction}
      onClickSend={onClickSend}
      content={query.data}
      subtitle="Ordinal inscription"
      title={`# ${inscriptionNumber}`}
    />
  );
}
