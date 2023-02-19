import OrdinalLogo from '@assets/images/ordinal-logo.svg';
import { Box, Text, color } from '@stacks/ui';

// import { useQuery } from '@tanstack/react-query';
import { openInNewTab } from '@app/common/utils/open-in-new-tab';
import { Caption } from '@app/components/typography';
import { OrdinalType, useGetOrdinalsQuery } from '@app/query/bitcoin/ordinals/ordinals.query';

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
      {data.map(ordinal => {
        switch (ordinal.type) {
          case OrdinalType.Image: {
            return (
              <Box>
                <Box pb="base">
                  <Box
                    onClick={() => openInNewTab(ordinal.infoUrl)}
                    borderRadius="16px"
                    sx={{ overflow: 'hidden' }}
                    _hover={{ cursor: 'pointer' }}
                  >
                    <img
                      key={ordinal.content}
                      src={ordinal.content.replace('content', 'inscription')}
                      style={{ aspectRatio: '1 / 1', objectFit: 'cover' }}
                    />
                  </Box>
                </Box>
                <Box pb="base-tight" pl="tight">
                  <Text pb="extra-tight" fontWeight="500" color={color('text-body')}>
                    {ordinal.title}
                  </Text>

                  {/* NOTE: using `style` since font size gets overriden when using `fontSize` or `sx`. */}
                  <Caption style={{ fontSize: '12px' }}>Ordinal inscription</Caption>
                </Box>
              </Box>
            );
          }
          case OrdinalType.Other: {
            return (
              <Box>
                <Box pb="base">
                  <Box
                    sx={{
                      position: 'relative',
                      paddingBottom: '100%',
                      height: '0',
                    }}
                  >
                    <Box
                      onClick={() => openInNewTab(ordinal.infoUrl)}
                      borderRadius="16px"
                      backgroundColor="black" // NOTE: color not yet available from `@stacks/ui`.
                      sx={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                      _hover={{ cursor: 'pointer' }}
                    >
                      <img src={OrdinalLogo} />
                    </Box>
                  </Box>
                </Box>
                <Box pb="base-tight" pl="tight">
                  <Text pb="extra-tight" fontWeight="500" color={color('text-body')}>
                    {ordinal.title}
                  </Text>

                  {/* NOTE: using `style` since font size gets overriden when using `fontSize` or `sx`. */}
                  <Caption style={{ fontSize: '12px' }}>Ordinal inscription</Caption>
                </Box>
              </Box>
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
