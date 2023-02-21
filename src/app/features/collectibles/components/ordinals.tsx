// import { useQuery } from '@tanstack/react-query';
import { openInNewTab } from '@app/common/utils/open-in-new-tab';
import { OrdinalType, useGetOrdinalsQuery } from '@app/query/bitcoin/ordinals/ordinals.query';

import { CollectibleImage } from './collectible-image';
import { CollectibleOther } from './collectible-other';

interface OrdinalsProps {
  query: ReturnType<typeof useGetOrdinalsQuery>;
}
export function Ordinals({ query }: OrdinalsProps) {
  const { isLoading, isError, data } = query;

  if (isLoading) return null;

  // TODO: Handle error in UI
  if (isError) return null;

  if (data.length === 0) return null;

  return (
    <>
      {data.map(ordinal => {
        switch (ordinal.type) {
          case OrdinalType.Image: {
            return (
              <CollectibleImage
                onSelectCollectible={() => openInNewTab(ordinal.infoUrl)}
                src={ordinal.content}
                subtitle="Ordinal inscription"
                title={ordinal.title}
              />
            );
          }
          case OrdinalType.Other: {
            return (
              <CollectibleOther
                onSelectCollectible={() => openInNewTab(ordinal.infoUrl)}
                subtitle="Ordinal inscription"
                title={ordinal.title}
              />
            );
          }
          default: {
            return null;
          }
        }
      })}
    </>
  );
}
