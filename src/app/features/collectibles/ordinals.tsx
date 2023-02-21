import { openInNewTab } from '@app/common/utils/open-in-new-tab';
import { useGetOrdinalsQuery } from '@app/query/bitcoin/ordinals/ordinals.query';

import { ImageCollectible } from './components/image-collectible';
import { OtherCollectible } from './components/other-collectible';

interface OrdinalsProps {
  query: ReturnType<typeof useGetOrdinalsQuery>;
}
export function Ordinals({ query }: OrdinalsProps) {
  const { isLoading, isError, data: ordinals } = query;

  if (isLoading) return null;

  // TODO: user facing error handling.
  if (isError) return null;

  if (ordinals.length === 0) return null;

  return (
    <>
      {ordinals.map(ordinal => {
        switch (ordinal.type) {
          case 'image': {
            return (
              <ImageCollectible
                key={ordinal.infoUrl}
                onClick={() => openInNewTab(ordinal.infoUrl)}
                src={ordinal.content}
                subtitle="Ordinal inscription"
                title={ordinal.title}
              />
            );
          }
          case 'other': {
            return (
              <OtherCollectible
                key={ordinal.infoUrl}
                onClick={() => openInNewTab(ordinal.infoUrl)}
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
