import { Box, Text, color } from '@stacks/ui';

// import { useQuery } from '@tanstack/react-query';
import { openInNewTab } from '@app/common/utils/open-in-new-tab';
import { Caption } from '@app/components/typography';
import { useGetOrdinalsQuery } from '@app/query/bitcoin/ordinals/ordinals.query';

interface OrdinalsProps {
  query: ReturnType<typeof useGetOrdinalsQuery>;
}
export function Ordinals({ query }: OrdinalsProps) {
  const { isLoading, isError, data } = query;

  if (isLoading) return null;

  // TODO: user facing error handling.
  if (isError) return null;

  if (data.length === 0) return null;

  // const qMockImages = useQuery(['mock'], async () => {
  //   const res = await fetch('https://picsum.photos/v2/list');
  //   const resParsed = await res.json();
  //   return resParsed.map(i => ({
  //     title: 'Foo title',
  //     content: i.download_url,
  //     preview: `http://localhost:1234?dl=${i.download_url}`,
  //   }));
  // });

  return (
    <>
      {/* {qMockImages.data && */}
      {/*   qMockImages.data.map(ordinal => ( */}
      {data.map(ordinal => (
        <Box>
          <Box pb="base">
            <Box
              onClick={() => openInNewTab(ordinal.preview)}
              borderRadius="12px"
              sx={{ overflow: 'hidden' }}
              _hover={{ cursor: 'pointer' }}
            >
              <img
                key={ordinal.content}
                src={ordinal.content}
                style={{ aspectRatio: '1 / 1', objectFit: 'cover' }}
              />
            </Box>
          </Box>
          <Box pb="base-tight">
            <Text pb="extra-tight" fontWeight="500" color={color('text-body')}>
              {ordinal.title}
            </Text>

            {/* NOTE: using `style` since font size gets overriden when using `fontSize` or `sx`. */}
            <Caption style={{ fontSize: '12px' }}>Ordinal inscription</Caption>
          </Box>
        </Box>
      ))}
    </>
  );
}
