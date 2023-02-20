// import { useQuery } from '@tanstack/react-query';
import { openInNewTab } from '@app/common/utils/open-in-new-tab';
import { OrdinalType, useGetOrdinalsQuery } from '@app/query/bitcoin/ordinals/ordinals.query';

import { ImageCollectible } from './components/image-collectible';
import { OtherCollectible } from './components/other-collectible';

interface OrdinalsProps {
  query: ReturnType<typeof useGetOrdinalsQuery>;
}
export function Ordinals({ query }: OrdinalsProps) {
  const { isLoading, isError, data } = query;

  // const qMockImages = useQuery(['mock'], async () => {
  //   const res = await fetch('https://picsum.photos/v2/list');
  //   const resParsed = await res.json();
  //   return resParsed.map(i => ({
  //     title: 'Foo title',
  //     content: i.download_url,
  //     preview: `http://localhost:1234?dl=${i.download_url}`,
  //   }));
  // });
  // if (Math.random() < 1) {
  //   return (
  //     <>
  //       <p>working?</p>
  //       {qMockImages.data &&
  //         qMockImages.data
  //           .slice(12)
  //           .map(ordinal => (
  //             <ImageCollectible
  //               onClick={() => alert('clicked')}
  //               src={ordinal.content}
  //               subtitle="Ordinal inscription"
  //               title={ordinal.title}
  //             />
  //           ))}
  //     </>
  //   );
  // }

  // if (Math.random() < 1) {
  //   return (
  //     <OtherCollectible
  //       onClick={() => alert('clicked')}
  //       subtitle="Ordinal inscription"
  //       title="Foo"
  //     />
  //   );
  // }

  if (isLoading) return null;

  // TODO: user facing error handling.
  if (isError) return null;

  if (data.length === 0) return null;

  return (
    <>
      {data.map(ordinal => {
        switch (ordinal.type) {
          case OrdinalType.Image: {
            return (
              <ImageCollectible
                onClick={() => openInNewTab(ordinal.infoUrl)}
                src={ordinal.content}
                subtitle="Ordinal inscription"
                title={ordinal.title}
              />
            );
          }
          case OrdinalType.Other: {
            return (
              <OtherCollectible
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
